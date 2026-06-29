import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { sendResponse } from '../../shared/responses/response';
import { RegisterUserSchema } from './user.dto';
import { ValidationError } from '../../shared/errors/AppError';

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = RegisterUserSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }

      const user = await this.userService.register(parsed.data);

      sendResponse({
        res,
        statusCode: 201,
        message: 'User account registered successfully',
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

  public getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const user = await this.userService.getUserById(userId);

      sendResponse({
        res,
        message: 'Profile details fetched successfully',
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
}
