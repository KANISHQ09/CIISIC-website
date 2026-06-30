import { Router } from 'express';
import { ProposalController } from './proposal.controller';
import { authenticate, requireRole } from '../../shared/middleware/authMiddleware';

const router = Router();
const controller = new ProposalController();

// Protected Proposal routes
router.get('/', authenticate as any, controller.getProposals);
router.get('/analytics/proposals', authenticate as any, controller.getAnalytics);
router.get('/timeline/:proposalId', authenticate as any, controller.getTimeline);
router.post('/:id/comment', authenticate as any, controller.addComment);
router.get('/:id', authenticate as any, controller.getProposalById);
router.post('/', authenticate as any, requireRole(['STUDENT']) as any, controller.createDraft);
router.post(
  '/:id/submit',
  authenticate as any,
  requireRole(['STUDENT']) as any,
  controller.submitProposal,
);
router.post(
  '/:id/verify',
  authenticate as any,
  requireRole(['SUPER_ADMIN', 'INSTITUTION_SPOC']) as any,
  controller.verifyInstitution,
);
router.post(
  '/:id/reviewers',
  authenticate as any,
  requireRole(['SUPER_ADMIN']) as any,
  controller.assignReviewer,
);
router.post(
  '/:id/decision',
  authenticate as any,
  requireRole(['SUPER_ADMIN', 'INDUSTRY_SPOC']) as any,
  controller.companyDecision,
);

export default router;
