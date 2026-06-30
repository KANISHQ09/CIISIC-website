import { Router } from 'express';
import { UserController } from '../modules/users/user.controller';
import { authenticate, requireRole } from '../shared/middleware/authMiddleware';
import authRoutes from '../modules/auth/auth.routes';
import cellRoutes from '../modules/cells/cell.routes';
import institutionRoutes from '../modules/institutions/institution.routes';
import companyRoutes from '../modules/companies/company.routes';
import challengeRoutes from '../modules/challenges/challenge.routes';
import proposalRoutes from '../modules/proposals/proposal.routes';
import reviewRoutes from '../modules/reviews/review.routes';
import messageRoutes from '../modules/messages/message.routes';
import notificationRoutes from '../modules/notifications/notification.routes';
import uploadRoutes from '../modules/uploads/upload.routes';
import searchRoutes from '../modules/search/search.routes';
import analyticsRoutes from '../modules/analytics/analytics.routes';
import platformRoutes from '../modules/platform/platform.routes';

import auditRoutes from '../modules/audit/audit.routes';

const router = Router();
const userController = new UserController();

// Version 1 Routes
router.use('/v1/auth', authRoutes);
router.use('/v1/cells', cellRoutes);
router.use('/v1/institutions', institutionRoutes);
router.use('/v1/companies', companyRoutes);
router.use('/v1/challenges', challengeRoutes);
router.use('/v1/proposals', proposalRoutes);
router.use('/v1/reviews', reviewRoutes);
router.use('/v1/messages', messageRoutes);
router.use('/v1/notifications', notificationRoutes);
router.use('/v1/uploads', uploadRoutes);
router.use('/v1/search', searchRoutes);
router.use('/v1/analytics', analyticsRoutes);
router.use('/v1/platform', platformRoutes);
router.use('/v1/audit', auditRoutes);

router.get('/v1/users', authenticate as any, requireRole(['SUPER_ADMIN']) as any, userController.getUsers);
router.post('/v1/users', authenticate as any, requireRole(['SUPER_ADMIN']) as any, userController.createUser);
router.patch('/v1/users/:id/status', authenticate as any, requireRole(['SUPER_ADMIN']) as any, userController.updateUserStatus);
router.patch('/v1/users/:id/verify', authenticate as any, requireRole(['SUPER_ADMIN']) as any, userController.verifyUser);

router.get('/v1/profile', authenticate as any, userController.getProfile);
router.patch('/v1/profile', authenticate as any, userController.updateProfile);

export default router;
