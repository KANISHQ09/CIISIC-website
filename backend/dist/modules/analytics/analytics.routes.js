"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("./analytics.controller");
const authMiddleware_1 = require("../../shared/middleware/authMiddleware");
const router = (0, express_1.Router)();
const controller = new analytics_controller_1.AnalyticsController();
// Protected Analytics endpoints
router.get('/dashboard', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN', 'INSTITUTION_SPOC', 'INDUSTRY_SPOC']), controller.getDashboardStats);
exports.default = router;
