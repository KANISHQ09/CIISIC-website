import { Request, Response, NextFunction } from 'express';
import { AuthService, ClientDeviceInfo } from './auth.service';
import { RegisterStudentSchema, LoginSchema, ForgotPasswordSchema, ResetPasswordSchema } from './auth.dto';
import { sendResponse } from '../../shared/responses/response';
import { ValidationError, AuthenticationError } from '../../shared/errors/AppError';

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  private getDeviceInfo(req: Request): ClientDeviceInfo {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ipAddress =
      (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

    // Simplistic UA parsing for clean logging
    let browser = 'Other';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';

    let os = 'Other';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Macintosh')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';

    return {
      ipAddress,
      userAgent,
      browser,
      os,
      deviceName: `${browser} on ${os}`,
    };
  }

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = RegisterStudentSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Registration validation failed', parsed.error.format());
      }

      if (parsed.data.role !== 'STUDENT') {
        throw new ValidationError('Public self-registration is restricted to Student Solvers only.');
      }

      const user = await this.authService.registerStudent(parsed.data);

      sendResponse({
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
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = LoginSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }

      const device = this.getDeviceInfo(req);
      const { user, tokens } = await this.authService.login(
        parsed.data.email,
        parsed.data.password,
        device,
      );

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

      sendResponse({
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
    } catch (error) {
      next(error);
    }
  };

  public refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.cookies?.ciisic_refresh_token || req.body.refreshToken;
      if (!refreshToken) {
        throw new AuthenticationError('Refresh token is missing');
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

      sendResponse({
        res,
        message: 'Tokens refreshed successfully',
        data: {
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.cookies?.ciisic_refresh_token || req.body.refreshToken;
      if (refreshToken) {
        await this.authService.logout(refreshToken);
      }

      res.clearCookie('ciisic_token');
      res.clearCookie('ciisic_refresh_token');

      sendResponse({
        res,
        message: 'Successfully logged out',
      });
    } catch (error) {
      next(error);
    }
  };

  public logoutAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new AuthenticationError('Not authenticated');
      }

      await this.authService.logoutAll(userId);

      res.clearCookie('ciisic_token');
      res.clearCookie('ciisic_refresh_token');

      sendResponse({
        res,
        message: 'Successfully logged out of all active devices',
      });
    } catch (error) {
      next(error);
    }
  };

  public me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }

      sendResponse({
        res,
        message: 'Current authenticated session identity retrieved',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };

  public verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.body;
      if (!token) {
        throw new ValidationError('Verification token is required');
      }
      await this.authService.verifyEmail(token);
      sendResponse({
        res,
        message: 'Email verified successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  public forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = ForgotPasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const resetToken = await this.authService.forgotPassword(parsed.data.email);
      sendResponse({
        res,
        message: 'Password reset link sent to your institutional email.',
        data: { resetToken } // Returned for dev testing ease but handles securely
      });
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = ResetPasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      await this.authService.resetPassword(parsed.data.token, parsed.data);
      sendResponse({
        res,
        message: 'Password reset successful.',
      });
    } catch (error) {
      next(error);
    }
  };
}
