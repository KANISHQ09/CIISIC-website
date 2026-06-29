import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { jwtConfig } from '../../config/jwt';
import { UserRepository } from '../users/user.repository';
import { SessionRepository, RefreshTokenRepository } from './auth.repository';
import { AuthenticationError, ConflictError, NotFoundError } from '../../shared/errors/AppError';
import { IUser } from '../../database/schemas/User';
import StudentProfileModel from '../../database/schemas/StudentProfile';
import InstitutionModel from '../../database/schemas/Institution';
import AuditLogModel from '../../database/schemas/AuditLog';

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export interface ClientDeviceInfo {
  ipAddress: string;
  userAgent: string;
  browser: string;
  os: string;
  deviceName: string;
}

export class AuthService {
  private readonly userRepository: UserRepository;
  private readonly sessionRepository: SessionRepository;
  private readonly refreshTokenRepository: RefreshTokenRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.sessionRepository = new SessionRepository();
    this.refreshTokenRepository = new RefreshTokenRepository();
  }

  public generateTokens(payload: TokenPayload) {
    const accessToken = jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.accessExpiration as any,
    });

    const refreshToken = jwt.sign({ id: payload.id }, jwtConfig.refreshSecret, {
      expiresIn: jwtConfig.refreshExpiration as any,
    });

    return { accessToken, refreshToken };
  }

  public async registerStudent(dto: any): Promise<IUser> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictError('Email address is already in use');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    // Create User
    const user = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: dto.role === 'ADMIN' ? 'SUPER_ADMIN' : dto.role,
      isVerified: dto.role === 'STUDENT' ? false : true, // Non-students invited by admins are pre-verified
    });

    if (user.role === 'STUDENT') {
      const institution = await InstitutionModel.findOne({ code: 'LNCT' });
      const institutionId = institution ? institution._id : new mongoose.Types.ObjectId();

      // Create StudentProfile linked to user
      await StudentProfileModel.create({
        userId: user._id,
        enrollmentNo: dto.profileData?.enrollmentNo || `CII/ST/${Date.now().toString().slice(-4)}`,
        institutionId,
        department: dto.profileData?.department || 'Computer Science',
        yearOfStudy: dto.profileData?.yearOfStudy || 1,
        skills: dto.profileData?.skills || [],
      });
    }

    // Audit Event
    await AuditLogModel.create({
      userId: user._id,
      userName: user.name,
      action: 'USER_REGISTERED',
      description: `User account registered: ${user.email} as ${user.role}`,
      ipAddress: '0.0.0.0',
      category: 'AUTH',
    });

    return user;
  }

  public async login(
    email: string,
    password: string,
    device: ClientDeviceInfo,
  ): Promise<{ user: IUser; tokens: { accessToken: string; refreshToken: string } }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      // Audit login failure
      await AuditLogModel.create({
        userId: user._id,
        userName: user.name,
        action: 'LOGIN_FAILED',
        description: `Failed password login attempt for ${email}`,
        ipAddress: device.ipAddress,
        category: 'AUTH',
      });
      throw new AuthenticationError('Invalid credentials');
    }

    const payload: TokenPayload = {
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
    await AuditLogModel.create({
      userId: user._id,
      userName: user.name,
      action: 'USER_LOGIN',
      description: `Successful login from ${device.browser} / ${device.os}`,
      ipAddress: device.ipAddress,
      category: 'AUTH',
    });

    return { user, tokens };
  }

  public async refresh(
    refreshToken: string,
    device: ClientDeviceInfo,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret) as { id: string };

      const activeToken = await this.refreshTokenRepository.findActiveToken(refreshToken);
      if (!activeToken) {
        throw new AuthenticationError('Refresh token has been revoked');
      }

      const user = await this.userRepository.findById(decoded.id);
      if (!user) {
        throw new AuthenticationError('User not found');
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
      const payload: TokenPayload = {
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
    } catch (err) {
      throw new AuthenticationError('Invalid refresh token');
    }
  }

  public async logout(refreshToken: string): Promise<void> {
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

  public async logoutAll(userId: string): Promise<void> {
    await this.refreshTokenRepository.revokeAllUserTokens(userId);
    const sessions = await this.sessionRepository.findActiveByUser(userId);
    for (const session of sessions) {
      session.isDeleted = true;
      await session.save();
    }
  }
}
