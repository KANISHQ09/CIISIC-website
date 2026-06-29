"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIController = void 0;
const ai_service_1 = require("./ai.service");
const response_1 = require("../../shared/responses/response");
const AppError_1 = require("../../shared/errors/AppError");
class AIController {
    aiService;
    constructor() {
        this.aiService = new ai_service_1.AIService();
    }
    analyzeSimilarity = async (req, res, next) => {
        try {
            const result = await this.aiService.analyzeProposalSimilarity(req.params.id);
            (0, response_1.sendResponse)({
                res,
                message: 'Proposal plagiarism and similarity analysis processed',
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    };
    summarizeProposal = async (req, res, next) => {
        try {
            const result = await this.aiService.generateReviewerAssistantSummary(req.params.id);
            (0, response_1.sendResponse)({
                res,
                message: 'Proposal abstract summary generated',
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    };
    recommendChallenges = async (req, res, next) => {
        try {
            const skillsQuery = req.query.skills;
            if (!skillsQuery) {
                throw new AppError_1.ValidationError('skills query parameter is required');
            }
            const skills = skillsQuery.split(',');
            const recommendations = await this.aiService.recommendChallengesForStudent(skills);
            (0, response_1.sendResponse)({
                res,
                message: 'Recommended challenges statement list matched',
                data: recommendations
            });
        }
        catch (error) {
            next(error);
        }
    };
    extractSkills = async (req, res, next) => {
        try {
            const { text } = req.body;
            if (!text) {
                throw new AppError_1.ValidationError('text payload is required');
            }
            const skills = await this.aiService.extractSkillsFromResume(text);
            (0, response_1.sendResponse)({
                res,
                message: 'Skills and keywords extracted successfully',
                data: { skills }
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AIController = AIController;
exports.default = AIController;
