"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("./notification.controller");
const authMiddleware_1 = require("../../shared/middleware/authMiddleware");
const router = (0, express_1.Router)();
const controller = new notification_controller_1.NotificationController();
// Protected Notification routes
router.get('/', authMiddleware_1.authenticate, controller.getNotifications);
router.patch('/read', authMiddleware_1.authenticate, controller.markAsRead);
exports.default = router;
