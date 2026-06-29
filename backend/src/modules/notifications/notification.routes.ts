import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { authenticate } from '../../shared/middleware/authMiddleware';

const router = Router();
const controller = new NotificationController();

// Protected Notification routes
router.get('/', authenticate as any, controller.getNotifications);
router.patch('/read', authenticate as any, controller.markAsRead);

export default router;
