import { Router } from 'express';
import { ChallengeController } from './challenge.controller';
import { authenticate, requireRole } from '../../shared/middleware/authMiddleware';

const router = Router();
const controller = new ChallengeController();

// Public challenges searches
router.get('/', controller.getChallenges);
router.get('/:id', controller.getChallengeById);

// Protected challenges lifecycle management
router.post(
  '/',
  authenticate as any,
  requireRole(['SUPER_ADMIN', 'INDUSTRY_SPOC']) as any,
  controller.createChallenge,
);
router.patch(
  '/:id',
  authenticate as any,
  requireRole(['SUPER_ADMIN', 'INDUSTRY_SPOC']) as any,
  controller.updateChallenge,
);
router.post(
  '/:id/publish',
  authenticate as any,
  requireRole(['SUPER_ADMIN', 'INSTITUTION_SPOC']) as any,
  controller.publish,
);
router.post(
  '/:id/archive',
  authenticate as any,
  requireRole(['SUPER_ADMIN', 'INDUSTRY_SPOC']) as any,
  controller.archive,
);
router.post(
  '/:id/close',
  authenticate as any,
  requireRole(['SUPER_ADMIN', 'INDUSTRY_SPOC']) as any,
  controller.close,
);
router.post(
  '/:id/reviewers',
  authenticate as any,
  requireRole(['SUPER_ADMIN']) as any,
  controller.assignReviewer,
);

export default router;
