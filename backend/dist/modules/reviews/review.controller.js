"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const review_service_1 = require("./review.service");
const response_1 = require("../../shared/responses/response");
const AppError_1 = require("../../shared/errors/AppError");
const reviewer_services_1 = require("./reviewer.services");
const Proposal_1 = __importDefault(require("../../database/schemas/Proposal"));
class ReviewController {
    reviewService;
    constructor() {
        this.reviewService = new review_service_1.ReviewService();
    }
    getReviewById = async (req, res, next) => {
        try {
            const review = await this.reviewService.getReviewById(req.params.id);
            (0, response_1.sendResponse)({
                res,
                message: 'Review details retrieved successfully',
                data: review,
            });
        }
        catch (error) {
            next(error);
        }
    };
    submitEvaluation = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new AppError_1.AuthenticationError('Not authenticated');
            }
            const review = await reviewer_services_1.EvaluationService.submitEvaluation(req.body, userId);
            (0, response_1.sendResponse)({
                res,
                statusCode: 201,
                message: 'Evaluation scorecard submitted successfully',
                data: review,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getReviewerDashboard = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new AppError_1.AuthenticationError('Not authenticated');
            }
            const stats = await reviewer_services_1.ReviewAnalyticsService.getReviewerStats(userId);
            const assignedProposals = await Proposal_1.default.find({ reviewerId: userId }).limit(10).exec();
            (0, response_1.sendResponse)({
                res,
                message: 'Reviewer dashboard metrics aggregated successfully',
                data: {
                    stats,
                    assignedProposals,
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
    getReviewerReviews = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new AppError_1.AuthenticationError('Not authenticated');
            }
            const proposals = await Proposal_1.default.find({ reviewerId: userId }).exec();
            (0, response_1.sendResponse)({
                res,
                message: 'Reviewer assigned proposal reviews queue list retrieved',
                data: proposals,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getReviewerProfile = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new AppError_1.AuthenticationError('Not authenticated');
            }
            const user = await reviewer_services_1.ReviewerService.getReviewerProfile(userId);
            (0, response_1.sendResponse)({
                res,
                message: 'Reviewer profile data retrieved successfully',
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getReviewerStatistics = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new AppError_1.AuthenticationError('Not authenticated');
            }
            const stats = await reviewer_services_1.ReviewAnalyticsService.getReviewerStats(userId);
            (0, response_1.sendResponse)({
                res,
                message: 'Reviewer statistics aggregated successfully',
                data: stats,
            });
        }
        catch (error) {
            next(error);
        }
    };
    addComment = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new AppError_1.AuthenticationError('Not authenticated');
            }
            const { commentText } = req.body;
            if (!commentText) {
                throw new AppError_1.ValidationError('commentText is required');
            }
            const proposal = await reviewer_services_1.DiscussionService.addReviewerComment(req.params.id, commentText, userId);
            (0, response_1.sendResponse)({
                res,
                message: 'Reviewer evaluation notes comment added successfully',
                data: proposal,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.ReviewController = ReviewController;
