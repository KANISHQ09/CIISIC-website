"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.refreshToken = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const JWT_SECRET = process.env.JWT_SECRET || 'ciisic-secret-key-12345';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'ciisic-refresh-secret-key-12345';
// Helper to generate access tokens
const generateAccessToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '15m' });
};
// Helper to generate refresh tokens
const generateRefreshToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ id: userId, role }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};
const register = async (req, res) => {
    try {
        const { name, email, password, role, profileData } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ success: false, error: 'Email already registered' });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const newUser = new User_1.default({
            name,
            email,
            passwordHash,
            role,
            isVerified: false,
            studentProfile: role === 'STUDENT' ? profileData : undefined,
            industryProfile: role === 'INDUSTRY_SPOC' ? profileData : undefined,
            institutionProfile: role === 'INSTITUTION_SPOC' ? profileData : undefined
        });
        await newUser.save();
        const accessToken = generateAccessToken(newUser._id.toString(), newUser.role);
        const refreshToken = generateRefreshToken(newUser._id.toString(), newUser.role);
        // Save refresh token in HttpOnly cookie in production
        res.cookie('ciisic_refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(201).json({
            success: true,
            token: accessToken,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                isVerified: newUser.isVerified
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ success: false, error: 'Invalid email or password' });
            return;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ success: false, error: 'Invalid email or password' });
            return;
        }
        const accessToken = generateAccessToken(user._id.toString(), user.role);
        const refreshToken = generateRefreshToken(user._id.toString(), user.role);
        res.cookie('ciisic_refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({
            success: true,
            token: accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.login = login;
const refreshToken = async (req, res) => {
    try {
        const token = req.cookies?.ciisic_refresh_token || req.body.refreshToken;
        if (!token) {
            res.status(403).json({ success: false, error: 'Refresh token required' });
            return;
        }
        jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) {
                res.status(403).json({ success: false, error: 'Invalid refresh token' });
                return;
            }
            const accessToken = generateAccessToken(decoded.id, decoded.role);
            res.status(200).json({ success: true, token: accessToken });
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.refreshToken = refreshToken;
const getMe = async (req, res) => {
    try {
        // Assuming auth middleware populates req.user
        const user = await User_1.default.findById(req.user?.id).select('-passwordHash');
        if (!user) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getMe = getMe;
