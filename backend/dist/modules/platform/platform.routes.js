"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const platform_controller_1 = require("./platform.controller");
const authMiddleware_1 = require("../../shared/middleware/authMiddleware");
const router = (0, express_1.Router)();
const controller = new platform_controller_1.PlatformController();
// CMS Endpoints
router.get('/cms/:slug', controller.getPage);
router.post('/cms/:slug', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN']), controller.updatePage);
// Settings Endpoints
router.get('/settings/:key', authMiddleware_1.authenticate, controller.getSetting);
router.post('/settings/:key', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN']), controller.updateSetting);
// Announcements Endpoints
router.get('/announcements', authMiddleware_1.authenticate, controller.getAnnouncements);
router.post('/announcements', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN']), controller.createAnnouncement);
// Resources Endpoints
router.get('/resources', authMiddleware_1.authenticate, controller.getResources);
router.post('/resources', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN']), controller.createResource);
// Platform Operations & Health check
router.get('/health', controller.getPlatformHealth);
router.get('/readiness', controller.getReadiness);
router.get('/liveness', controller.getLiveness);
exports.default = router;
