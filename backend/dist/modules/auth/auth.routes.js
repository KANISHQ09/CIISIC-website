"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const authMiddleware_1 = require("../../shared/middleware/authMiddleware");
const rateLimiter_1 = require("../../shared/middleware/rateLimiter");
const router = (0, express_1.Router)();
const controller = new auth_controller_1.AuthController();
router.post('/register', rateLimiter_1.authRateLimiter, controller.register);
router.post('/login', rateLimiter_1.authRateLimiter, controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);
// Protected routes
router.post('/logout-all', authMiddleware_1.authenticate, controller.logoutAll);
router.get('/me', authMiddleware_1.authenticate, controller.me);
exports.default = router;
