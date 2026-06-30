"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const proposal_controller_1 = require("./proposal.controller");
const authMiddleware_1 = require("../../shared/middleware/authMiddleware");
const router = (0, express_1.Router)();
const controller = new proposal_controller_1.ProposalController();
// Protected Proposal routes
router.get('/', authMiddleware_1.authenticate, controller.getProposals);
router.get('/analytics/proposals', authMiddleware_1.authenticate, controller.getAnalytics);
router.get('/timeline/:proposalId', authMiddleware_1.authenticate, controller.getTimeline);
router.post('/:id/comment', authMiddleware_1.authenticate, controller.addComment);
router.get('/:id', authMiddleware_1.authenticate, controller.getProposalById);
router.post('/', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['STUDENT']), controller.createDraft);
router.post('/:id/submit', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['STUDENT']), controller.submitProposal);
router.post('/:id/verify', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN', 'INSTITUTION_SPOC']), controller.verifyInstitution);
router.post('/:id/reviewers', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN']), controller.assignReviewer);
router.post('/:id/decision', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN', 'INDUSTRY_SPOC']), controller.companyDecision);
exports.default = router;
