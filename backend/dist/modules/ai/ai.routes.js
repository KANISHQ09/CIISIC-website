"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_controller_1 = require("./ai.controller");
const authMiddleware_1 = require("../../shared/middleware/authMiddleware");
const router = (0, express_1.Router)();
const controller = new ai_controller_1.AIController();
// Protected AI routes
router.post('/proposals/:id/similarity', authMiddleware_1.authenticate, controller.analyzeSimilarity);
router.post('/proposals/:id/summarize', authMiddleware_1.authenticate, controller.summarizeProposal);
router.post('/skills/extract', authMiddleware_1.authenticate, controller.extractSkills);
router.get('/challenges/recommend', authMiddleware_1.authenticate, controller.recommendChallenges);
exports.default = router;
