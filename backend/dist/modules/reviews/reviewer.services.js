"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewAnalyticsService = exports.ComparisonService = exports.DiscussionService = exports.ReviewAssignmentService = exports.ScoringService = exports.EvaluationService = exports.ReviewerService = void 0;
const mongoose_1 = require("mongoose");
const Review_1 = __importDefault(require("../../database/schemas/Review"));
const Proposal_1 = __importDefault(require("../../database/schemas/Proposal"));
const User_1 = __importDefault(require("../../database/schemas/User"));
const ActivityLog_1 = __importDefault(require("../../database/schemas/ActivityLog"));
const Notification_1 = __importDefault(require("../../database/schemas/Notification"));
const AppError_1 = require("../../shared/errors/AppError");
// 1. ReviewerService
class ReviewerService {
    static async getReviewerProfile(userId) {
        const user = await User_1.default.findById(userId).select('-password');
        if (!user) {
            throw new AppError_1.NotFoundError('Reviewer not found');
        }
        return user;
    }
}
exports.ReviewerService = ReviewerService;
// 2. EvaluationService
class EvaluationService {
    static async getReviewById(id) {
        const review = await Review_1.default.findById(id);
        if (!review) {
            throw new AppError_1.NotFoundError('Evaluation review scorecard not found');
        }
        return review;
    }
    static async submitEvaluation(data, userId) {
        const proposal = await Proposal_1.default.findById(data.proposalId);
        if (!proposal) {
            throw new AppError_1.NotFoundError('Proposal not found');
        }
        if (proposal.reviewerId?.toString() !== userId) {
            throw new AppError_1.ValidationError('Forbidden: You are not the assigned reviewer for this proposal');
        }
        const totalScore = ScoringService.calculateWeightedScore(data);
        const review = await Review_1.default.create({
            ...data,
            totalScore,
            evaluatedBy: new mongoose_1.Types.ObjectId(userId),
        });
        proposal.status = 'REVIEW_COMPLETED';
        proposal.reviewScores = {
            innovation: data.innovationScore,
            technical: data.technicalScore || 5,
            feasibility: data.feasibilityScore,
            scalability: data.scalabilityScore || 5,
            documentation: data.documentationScore,
            businessImpact: data.businessImpactScore || 5,
            weightedScore: totalScore,
        };
        proposal.decisionHistory.push({
            status: 'REVIEW_COMPLETED',
            actionBy: new mongoose_1.Types.ObjectId(userId),
            comments: `Evaluation scorecard completed: Score ${totalScore}/10`,
            timestamp: new Date(),
        });
        await proposal.save();
        await Notification_1.default.create({
            userId: proposal.solverId,
            type: 'SUCCESS',
            category: 'REVIEW',
            priority: 'MEDIUM',
            title: 'Technical Review Submitted',
            content: `Your proposal "${proposal.title}" technical review has been completed.`,
            deepLink: `/portal/student/proposals/${proposal._id}`,
        });
        await ActivityLog_1.default.create({
            userId: new mongoose_1.Types.ObjectId(userId),
            event: 'PROPOSAL_REVIEW_SUBMITTED',
            metadata: { proposalId: proposal._id, reviewId: review._id, totalScore },
        });
        return review;
    }
}
exports.EvaluationService = EvaluationService;
// 3. ScoringService
class ScoringService {
    static calculateWeightedScore(data) {
        const innovation = data.innovationScore || 0;
        const technical = data.technicalScore || 0;
        const feasibility = data.feasibilityScore || 0;
        const scalability = data.scalabilityScore || 0;
        const documentation = data.documentationScore || 0;
        const businessImpact = data.businessImpactScore || 0;
        // Return simple rounded average of specified parameters
        return Math.round((innovation + technical + feasibility + scalability + documentation + businessImpact) / 6);
    }
}
exports.ScoringService = ScoringService;
// 4. ReviewAssignmentService
class ReviewAssignmentService {
    static async assignReviewer(proposalId, reviewerId, adminUserId) {
        const proposal = await Proposal_1.default.findById(proposalId);
        if (!proposal) {
            throw new AppError_1.NotFoundError('Proposal not found');
        }
        proposal.status = 'REVIEW_ASSIGNED';
        proposal.reviewerId = new mongoose_1.Types.ObjectId(reviewerId);
        proposal.decisionHistory.push({
            status: 'REVIEW_ASSIGNED',
            actionBy: new mongoose_1.Types.ObjectId(adminUserId),
            comments: 'Reviewer allocated to evaluate proposal statement',
            timestamp: new Date(),
        });
        await proposal.save();
        await Notification_1.default.create({
            userId: new mongoose_1.Types.ObjectId(reviewerId),
            type: 'INFO',
            category: 'REVIEW',
            priority: 'HIGH',
            title: 'New Review Assigned',
            content: `You have been allocated to evaluate proposal "${proposal.title}"`,
            deepLink: `/portal/reviewer/proposals/${proposal._id}`,
        });
        return proposal;
    }
}
exports.ReviewAssignmentService = ReviewAssignmentService;
// 5. DiscussionService
class DiscussionService {
    static async addReviewerComment(proposalId, commentText, userId) {
        const proposal = await Proposal_1.default.findById(proposalId);
        if (!proposal) {
            throw new AppError_1.NotFoundError('Proposal not found');
        }
        if (proposal.reviewerId?.toString() !== userId) {
            throw new AppError_1.ValidationError('Forbidden: You are not the assigned reviewer for this proposal');
        }
        proposal.decisionHistory.push({
            status: 'COMMENT_ADDED',
            actionBy: new mongoose_1.Types.ObjectId(userId),
            comments: commentText,
            timestamp: new Date(),
        });
        await proposal.save();
        return proposal;
    }
}
exports.DiscussionService = DiscussionService;
// 6. ComparisonService
class ComparisonService {
    static async compareProposals(proposalIds) {
        const ids = proposalIds.map((id) => new mongoose_1.Types.ObjectId(id));
        return Proposal_1.default.find({ _id: { $in: ids } }).exec();
    }
}
exports.ComparisonService = ComparisonService;
// 7. ReviewAnalyticsService
class ReviewAnalyticsService {
    static async getReviewerStats(userId) {
        const rId = new mongoose_1.Types.ObjectId(userId);
        const assigned = await Proposal_1.default.countDocuments({ reviewerId: rId });
        const completed = await Proposal_1.default.countDocuments({
            reviewerId: rId,
            status: 'REVIEW_COMPLETED',
        });
        const pending = assigned - completed;
        // Aggregate average score
        const scoreResult = await Review_1.default.aggregate([
            { $match: { evaluatedBy: rId, isDeleted: { $ne: true } } },
            { $group: { _id: null, avgScore: { $avg: '$totalScore' } } },
        ]);
        const averageScore = scoreResult.length > 0 ? parseFloat(scoreResult[0].avgScore.toFixed(1)) : 0;
        return {
            assignedReviews: assigned,
            pendingReviews: pending,
            completedReviews: completed,
            averageScore,
            performanceTimeline: [
                { month: 'Apr', reviewsCompleted: Math.max(0, completed - 2) },
                { month: 'May', reviewsCompleted: Math.max(0, completed - 1) },
                { month: 'Jun', reviewsCompleted: completed },
            ],
        };
    }
}
exports.ReviewAnalyticsService = ReviewAnalyticsService;
