"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const challenge_controller_1 = require("./challenge.controller");
const authMiddleware_1 = require("../../shared/middleware/authMiddleware");
const router = (0, express_1.Router)();
const controller = new challenge_controller_1.ChallengeController();
// Public challenges searches
router.get('/', controller.getChallenges);
router.get('/:id', controller.getChallengeById);
// Protected challenges lifecycle management
router.post('/', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN', 'INDUSTRY_SPOC']), controller.createChallenge);
router.patch('/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN', 'INDUSTRY_SPOC']), controller.updateChallenge);
router.post('/:id/publish', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN', 'INSTITUTION_SPOC']), controller.publish);
router.post('/:id/archive', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN', 'INDUSTRY_SPOC']), controller.archive);
router.post('/:id/close', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN', 'INDUSTRY_SPOC']), controller.close);
router.post('/:id/reviewers', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN']), controller.assignReviewer);
exports.default = router;
