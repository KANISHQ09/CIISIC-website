import { Router } from 'express';
import { ReviewController } from './review.controller';
import { authenticate, requireRole } from '../../shared/middleware/authMiddleware';

const router = Router();
const controller = new ReviewController();

// Protected Review routes
router.get(
  '/reviewer/dashboard',
  authenticate as any,
  requireRole(['SUPER_ADMIN', 'REVIEWER']) as any,
  controller.getReviewerDashboard,
);
router.get(
  '/reviewer/reviews',
  authenticate as any,
  requireRole(['SUPER_ADMIN', 'REVIEWER']) as any,
  controller.getReviewerReviews,
);
router.get(
  '/reviewer/profile',
  authenticate as any,
  requireRole(['SUPER_ADMIN', 'REVIEWER']) as any,
  controller.getReviewerProfile,
);
router.get(
  '/reviewer/statistics',
  authenticate as any,
  requireRole(['SUPER_ADMIN', 'REVIEWER']) as any,
  controller.getReviewerStatistics,
);
router.post(
  '/reviewer/reviews/:id/comment',
  authenticate as any,
  requireRole(['SUPER_ADMIN', 'REVIEWER']) as any,
  controller.addComment,
);
router.get('/:id', authenticate as any, controller.getReviewById);
router.post(
  '/',
  authenticate as any,
  requireRole(['SUPER_ADMIN', 'REVIEWER']) as any,
  controller.submitEvaluation,
);

export default router;
