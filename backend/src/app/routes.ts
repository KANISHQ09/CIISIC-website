import { Router } from 'express';
import { UserController } from '../modules/users/user.controller';
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
router.post('/v1/users/register', userController.register);

export default router;
