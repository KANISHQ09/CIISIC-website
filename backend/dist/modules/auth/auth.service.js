"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const jwt_1 = require("../../config/jwt");
const user_repository_1 = require("../users/user.repository");
const auth_repository_1 = require("./auth.repository");
const AppError_1 = require("../../shared/errors/AppError");
const StudentProfile_1 = __importDefault(require("../../database/schemas/StudentProfile"));
const Institution_1 = __importDefault(require("../../database/schemas/Institution"));
const AuditLog_1 = __importDefault(require("../../database/schemas/AuditLog"));
class AuthService {
    userRepository;
    sessionRepository;
    refreshTokenRepository;
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
        this.sessionRepository = new auth_repository_1.SessionRepository();
        this.refreshTokenRepository = new auth_repository_1.RefreshTokenRepository();
    }
    generateTokens(payload) {
        const accessToken = jsonwebtoken_1.default.sign(payload, jwt_1.jwtConfig.secret, {
            expiresIn: jwt_1.jwtConfig.accessExpiration,
        });
        const refreshToken = jsonwebtoken_1.default.sign({ id: payload.id }, jwt_1.jwtConfig.refreshSecret, {
            expiresIn: jwt_1.jwtConfig.refreshExpiration,
        });
        return { accessToken, refreshToken };
    }
    async registerStudent(dto) {
        const existing = await this.userRepository.findByEmail(dto.email);
        if (existing) {
            throw new AppError_1.ConflictError('Email address is already in use');
        }
        const salt = await bcryptjs_1.default.genSalt(12);
        const passwordHash = await bcryptjs_1.default.hash(dto.password, salt);
        // Create User
        const user = await this.userRepository.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
            role: dto.role === 'ADMIN' ? 'SUPER_ADMIN' : dto.role,
            isVerified: dto.role === 'STUDENT' ? false : true, // Non-students invited by admins are pre-verified
        });
        if (user.role === 'STUDENT') {
            const institution = await Institution_1.default.findOne({ code: 'LNCT' });
            const institutionId = institution ? institution._id : new mongoose_1.default.Types.ObjectId();
            // Create StudentProfile linked to user
            await StudentProfile_1.default.create({
                userId: user._id,
                enrollmentNo: dto.profileData?.enrollmentNo || `CII/ST/${Date.now().toString().slice(-4)}`,
                institutionId,
                department: dto.profileData?.department || 'Computer Science',
                yearOfStudy: dto.profileData?.yearOfStudy || 1,
                skills: dto.profileData?.skills || [],
            });
        }
        // Audit Event
        await AuditLog_1.default.create({
            userId: user._id,
            userName: user.name,
            action: 'USER_REGISTERED',
            description: `User account registered: ${user.email} as ${user.role}`,
            ipAddress: '0.0.0.0',
            category: 'AUTH',
        });
        return user;
    }
    async login(email, password, device) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new AppError_1.AuthenticationError('Invalid credentials');
        }
        const isValid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isValid) {
            // Audit login failure
            await AuditLog_1.default.create({
                userId: user._id,
                userName: user.name,
                action: 'LOGIN_FAILED',
                description: `Failed password login attempt for ${email}`,
                ipAddress: device.ipAddress,
                category: 'AUTH',
            });
            throw new AppError_1.AuthenticationError('Invalid credentials');
        }
        const payload = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        };
        const tokens = this.generateTokens(payload);
        // Save Refresh Token
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        const dbToken = await this.refreshTokenRepository.create({
            userId: user._id,
            token: tokens.refreshToken,
            expiresAt,
            isRevoked: false,
        });
        // Save Session
        await this.sessionRepository.create({
            userId: user._id,
            token: tokens.refreshToken,
            ipAddress: device.ipAddress,
            userAgent: device.userAgent,
            expiresAt,
            isDeleted: false,
        });
        // Audit Event
        await AuditLog_1.default.create({
            userId: user._id,
            userName: user.name,
            action: 'USER_LOGIN',
            description: `Successful login from ${device.browser} / ${device.os}`,
            ipAddress: device.ipAddress,
            category: 'AUTH',
        });
        return { user, tokens };
    }
    async refresh(refreshToken, device) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, jwt_1.jwtConfig.refreshSecret);
            const activeToken = await this.refreshTokenRepository.findActiveToken(refreshToken);
            if (!activeToken) {
                throw new AppError_1.AuthenticationError('Refresh token has been revoked');
            }
            const user = await this.userRepository.findById(decoded.id);
            if (!user) {
                throw new AppError_1.AuthenticationError('User not found');
            }
            // Rotate token: revoke old token
            activeToken.isRevoked = true;
            await activeToken.save();
            // Deactivate matching session
            const session = await this.sessionRepository.findByToken(refreshToken);
            if (session) {
                session.isDeleted = true;
                await session.save();
            }
            // Generate new tokens
            const payload = {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
            };
            const tokens = this.generateTokens(payload);
            // Save new tokens
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            await this.refreshTokenRepository.create({
                userId: user._id,
                token: tokens.refreshToken,
                expiresAt,
                isRevoked: false,
            });
            await this.sessionRepository.create({
                userId: user._id,
                token: tokens.refreshToken,
                ipAddress: device.ipAddress,
                userAgent: device.userAgent,
                expiresAt,
                isDeleted: false,
            });
            return tokens;
        }
        catch (err) {
            throw new AppError_1.AuthenticationError('Invalid refresh token');
        }
    }
    async logout(refreshToken) {
        const token = await this.refreshTokenRepository.findOne({ token: refreshToken });
        if (token) {
            token.isRevoked = true;
            await token.save();
        }
        const session = await this.sessionRepository.findByToken(refreshToken);
        if (session) {
            session.isDeleted = true;
            await session.save();
        }
    }
    async logoutAll(userId) {
        await this.refreshTokenRepository.revokeAllUserTokens(userId);
        const sessions = await this.sessionRepository.findActiveByUser(userId);
        for (const session of sessions) {
            session.isDeleted = true;
            await session.save();
        }
    }
}
exports.AuthService = AuthService;
