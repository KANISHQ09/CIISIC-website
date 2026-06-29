"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("./review.controller");
const authMiddleware_1 = require("../../shared/middleware/authMiddleware");
const router = (0, express_1.Router)();
const controller = new review_controller_1.ReviewController();
// Protected Review routes
router.get('/reviewer/dashboard', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN', 'REVIEWER']), controller.getReviewerDashboard);
router.get('/reviewer/reviews', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN', 'REVIEWER']), controller.getReviewerReviews);
router.get('/reviewer/profile', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN', 'REVIEWER']), controller.getReviewerProfile);
router.get('/reviewer/statistics', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN', 'REVIEWER']), controller.getReviewerStatistics);
router.post('/reviewer/reviews/:id/comment', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN', 'REVIEWER']), controller.addComment);
router.get('/:id', authMiddleware_1.authenticate, controller.getReviewById);
router.post('/', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN', 'REVIEWER']), controller.submitEvaluation);
exports.default = router;
