"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_controller_1 = require("./message.controller");
const authMiddleware_1 = require("../../shared/middleware/authMiddleware");
const router = (0, express_1.Router)();
const controller = new message_controller_1.MessageController();
// Protected Message routes
router.get('/conversations', authMiddleware_1.authenticate, controller.getUserConversations);
router.post('/conversations', authMiddleware_1.authenticate, controller.getOrCreateConversation);
router.get('/', authMiddleware_1.authenticate, controller.getMessages);
router.post('/', authMiddleware_1.authenticate, controller.sendMessage);
exports.default = router;
