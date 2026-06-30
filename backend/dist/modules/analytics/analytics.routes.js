"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("./analytics.controller");
const authMiddleware_1 = require("../../shared/middleware/authMiddleware");
const router = (0, express_1.Router)();
const controller = new analytics_controller_1.AnalyticsController();
// Protected Analytics endpoints
router.get('/dashboard', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN', 'INSTITUTION_SPOC', 'INDUSTRY_SPOC']), controller.getDashboardStats);
router.get('/admin-dashboard', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN']), controller.getAdminDashboard);
router.get('/leaderboard', authMiddleware_1.authenticate, controller.getLeaderboard);
router.get('/badges', authMiddleware_1.authenticate, controller.getStudentBadges);
router.get('/institution-dashboard', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['INSTITUTION_SPOC', 'SUPER_ADMIN']), controller.getInstitutionDashboard);
router.get('/industry-dashboard', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['INDUSTRY_SPOC', 'SUPER_ADMIN']), controller.getIndustryDashboard);
exports.default = router;
