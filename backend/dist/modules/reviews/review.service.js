"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const review_repository_1 = require("./review.repository");
const AppError_1 = require("../../shared/errors/AppError");
const Proposal_1 = __importDefault(require("../../database/schemas/Proposal"));
const ActivityLog_1 = __importDefault(require("../../database/schemas/ActivityLog"));
const Notification_1 = __importDefault(require("../../database/schemas/Notification"));
class ReviewService {
    reviewRepository;
    constructor() {
        this.reviewRepository = new review_repository_1.ReviewRepository();
    }
    async getReviewById(id) {
        const review = await this.reviewRepository.findById(id);
        if (!review) {
            throw new AppError_1.NotFoundError('Evaluation scorecard review not found');
        }
        return review;
    }
    async submitEvaluation(data, userId, userName) {
        const proposal = await Proposal_1.default.findById(data.proposalId);
        if (!proposal) {
            throw new AppError_1.NotFoundError('Proposal statement not found');
        }
        // Weighted overall score logic
        const totalScore = Math.round((data.innovationScore +
            data.technicalScore +
            data.feasibilityScore +
            data.scalabilityScore +
            data.documentationScore +
            data.businessImpactScore) /
            6);
        const review = await this.reviewRepository.create({
            ...data,
            totalScore,
            evaluatedBy: userId,
        });
        // Update Proposal reviews overview summary scores block
        proposal.status = 'REVIEW_COMPLETED';
        proposal.reviewScores = {
            innovation: data.innovationScore,
            technical: data.technicalScore,
            feasibility: data.feasibilityScore,
            scalability: data.scalabilityScore,
            documentation: data.documentationScore,
            businessImpact: data.businessImpactScore,
            weightedScore: totalScore,
        };
        proposal.decisionHistory.push({
            status: 'REVIEW_COMPLETED',
            actionBy: userId,
            comments: `Evaluation scorecard completed: Overall score ${totalScore}/10`,
            timestamp: new Date(),
        });
        await proposal.save();
        // Trigger Notification for Student and Industry Spoc
        await Notification_1.default.create({
            userId: proposal.solverId,
            type: 'SUCCESS',
            category: 'REVIEW',
            priority: 'MEDIUM',
            title: 'Proposal Review Completed',
            content: `Your proposal "${proposal.title}" evaluation scoring has been completed.`,
            deepLink: `/portal/student/proposals/${proposal._id}`,
        });
        await ActivityLog_1.default.create({
            userId,
            event: 'PROPOSAL_REVIEW_SUBMITTED',
            metadata: { proposalId: proposal._id, reviewId: review._id, totalScore },
        });
        // Publish to Domain EventBus
        const { EventBus } = await Promise.resolve().then(() => __importStar(require('../../events/EventBus')));
        await EventBus.getInstance().publish('PROPOSAL_REVIEW_SUBMITTED', {
            proposalId: proposal._id,
            solverId: proposal.solverId,
        });
        return review;
    }
}
exports.ReviewService = ReviewService;
