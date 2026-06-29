import { Request, Response, NextFunction } from 'express';
import NotificationModel from '../../database/schemas/Notification';
import { sendResponse } from '../../shared/responses/response';
import { AuthenticationError } from '../../shared/errors/AppError';

export class NotificationController {
  public getNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new AuthenticationError('Not authenticated');
      }

      const list = await NotificationModel.find({ userId, isDeleted: { $ne: true } })
        .sort({ createdAt: -1 })
        .exec();
      sendResponse({
        res,
        message: 'Notifications list retrieved successfully',
        data: list,
      });
    } catch (error) {
      next(error);
    }
  };

  public markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new AuthenticationError('Not authenticated');
      }

      const { id } = req.body;
      if (id) {
        await NotificationModel.updateOne({ _id: id, userId }, { isRead: true }).exec();
      } else {
        await NotificationModel.updateMany({ userId, isRead: false }, { isRead: true }).exec();
      }

      sendResponse({
        res,
        message: 'Notifications marked as read',
      });
    } catch (error) {
      next(error);
    }
  };
}
