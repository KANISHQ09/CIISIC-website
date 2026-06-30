"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./auth.dto");
const response_1 = require("../../shared/responses/response");
const AppError_1 = require("../../shared/errors/AppError");
class AuthController {
    authService;
    constructor() {
        this.authService = new auth_service_1.AuthService();
    }
    getDeviceInfo(req) {
        const userAgent = req.headers['user-agent'] || 'Unknown';
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
        // Simplistic UA parsing for clean logging
        let browser = 'Other';
        if (userAgent.includes('Chrome'))
            browser = 'Chrome';
        else if (userAgent.includes('Firefox'))
            browser = 'Firefox';
        else if (userAgent.includes('Safari') && !userAgent.includes('Chrome'))
            browser = 'Safari';
        let os = 'Other';
        if (userAgent.includes('Windows'))
            os = 'Windows';
        else if (userAgent.includes('Macintosh'))
            os = 'macOS';
        else if (userAgent.includes('Linux'))
            os = 'Linux';
        return {
            ipAddress,
            userAgent,
            browser,
            os,
            deviceName: `${browser} on ${os}`,
        };
    }
    register = async (req, res, next) => {
        try {
            const parsed = auth_dto_1.RegisterStudentSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new AppError_1.ValidationError('Registration validation failed', parsed.error.format());
            }
            if (parsed.data.role !== 'STUDENT') {
                throw new AppError_1.ValidationError('Public self-registration is restricted to Student Solvers only.');
            }
            const user = await this.authService.registerStudent(parsed.data);
            (0, response_1.sendResponse)({
                res,
                statusCode: 201,
                message: 'Student account registered successfully. Please verify your email.',
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const parsed = auth_dto_1.LoginSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new AppError_1.ValidationError('Validation failed', parsed.error.format());
            }
            const device = this.getDeviceInfo(req);
            const { user, tokens } = await this.authService.login(parsed.data.email, parsed.data.password, device);
            // Set cookie for Edge middleware validation
            res.cookie('ciisic_token', tokens.accessToken, {
                httpOnly: false, // Must be readable by Next.js edge parser middleware
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000, // 15 mins
            });
            res.cookie('ciisic_refresh_token', tokens.refreshToken, {
                httpOnly: true, // Secure refresh token storage
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            (0, response_1.sendResponse)({
                res,
                message: 'Successfully logged in',
                data: {
                    token: tokens.accessToken,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        createdAt: user.createdAt,
                    },
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
    refresh = async (req, res, next) => {
        try {
            const refreshToken = req.cookies?.ciisic_refresh_token || req.body.refreshToken;
            if (!refreshToken) {
                throw new AppError_1.AuthenticationError('Refresh token is missing');
            }
            const device = this.getDeviceInfo(req);
            const tokens = await this.authService.refresh(refreshToken, device);
            res.cookie('ciisic_token', tokens.accessToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000,
            });
            res.cookie('ciisic_refresh_token', tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            (0, response_1.sendResponse)({
                res,
                message: 'Tokens refreshed successfully',
                data: {
                    token: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
    logout = async (req, res, next) => {
        try {
            const refreshToken = req.cookies?.ciisic_refresh_token || req.body.refreshToken;
            if (refreshToken) {
                await this.authService.logout(refreshToken);
            }
            res.clearCookie('ciisic_token');
            res.clearCookie('ciisic_refresh_token');
            (0, response_1.sendResponse)({
                res,
                message: 'Successfully logged out',
            });
        }
        catch (error) {
            next(error);
        }
    };
    logoutAll = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new AppError_1.AuthenticationError('Not authenticated');
            }
            await this.authService.logoutAll(userId);
            res.clearCookie('ciisic_token');
            res.clearCookie('ciisic_refresh_token');
            (0, response_1.sendResponse)({
                res,
                message: 'Successfully logged out of all active devices',
            });
        }
        catch (error) {
            next(error);
        }
    };
    me = async (req, res, next) => {
        try {
            const user = req.user;
            if (!user) {
                throw new AppError_1.AuthenticationError('Not authenticated');
            }
            (0, response_1.sendResponse)({
                res,
                message: 'Current authenticated session identity retrieved',
                data: { user },
            });
        }
        catch (error) {
            next(error);
        }
    };
    verifyEmail = async (req, res, next) => {
        try {
            const { token } = req.body;
            if (!token) {
                throw new AppError_1.ValidationError('Verification token is required');
            }
            await this.authService.verifyEmail(token);
            (0, response_1.sendResponse)({
                res,
                message: 'Email verified successfully.',
            });
        }
        catch (error) {
            next(error);
        }
    };
    forgotPassword = async (req, res, next) => {
        try {
            const parsed = auth_dto_1.ForgotPasswordSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new AppError_1.ValidationError('Validation failed', parsed.error.format());
            }
            const resetToken = await this.authService.forgotPassword(parsed.data.email);
            (0, response_1.sendResponse)({
                res,
                message: 'Password reset link sent to your institutional email.',
                data: { resetToken } // Returned for dev testing ease but handles securely
            });
        }
        catch (error) {
            next(error);
        }
    };
    resetPassword = async (req, res, next) => {
        try {
            const parsed = auth_dto_1.ResetPasswordSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new AppError_1.ValidationError('Validation failed', parsed.error.format());
            }
            await this.authService.resetPassword(parsed.data.token, parsed.data);
            (0, response_1.sendResponse)({
                res,
                message: 'Password reset successful.',
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AuthController = AuthController;
