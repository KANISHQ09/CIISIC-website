"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalController = void 0;
const proposal_service_1 = require("./proposal.service");
const response_1 = require("../../shared/responses/response");
const AppError_1 = require("../../shared/errors/AppError");
const ActivityLog_1 = __importDefault(require("../../database/schemas/ActivityLog"));
const Proposal_1 = __importDefault(require("../../database/schemas/Proposal"));
class ProposalController {
    proposalService;
    constructor() {
        this.proposalService = new proposal_service_1.ProposalService();
    }
    getProposals = async (req, res, next) => {
        try {
            const user = req.user;
            if (!user) {
                throw new AppError_1.AuthenticationError('Not authenticated');
            }
            // Enforce data isolation scope
            const filter = {};
            if (user.role === 'STUDENT') {
                filter.solverId = user.id;
            }
            else if (user.role === 'INDUSTRY_SPOC') {
                filter.companyId = user.id; // Or associated company
            }
            else if (user.role === 'REVIEWER') {
                filter.reviewerId = user.id;
            }
            const proposals = await this.proposalService.getProposals(filter);
            (0, response_1.sendResponse)({
                res,
                message: 'Proposals list retrieved successfully',
                data: proposals,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getProposalById = async (req, res, next) => {
        try {
            const proposal = await this.proposalService.getProposalById(req.params.id);
            (0, response_1.sendResponse)({
                res,
                message: 'Proposal details retrieved successfully',
                data: proposal,
            });
        }
        catch (error) {
            next(error);
        }
    };
    createDraft = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const userName = req.user?.name || 'Student Solver';
            if (!userId) {
                throw new AppError_1.AuthenticationError('Not authenticated');
            }
            const proposal = await this.proposalService.createDraft(req.body, userId, userName);
            (0, response_1.sendResponse)({
                res,
                statusCode: 201,
                message: 'Proposal draft created successfully',
                data: proposal,
            });
        }
        catch (error) {
            next(error);
        }
    };
    submitProposal = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const userName = req.user?.name || 'Student Solver';
            if (!userId) {
                throw new AppError_1.AuthenticationError('Not authenticated');
            }
            const proposal = await this.proposalService.submitProposal(req.params.id, userId, userName);
            (0, response_1.sendResponse)({
                res,
                message: 'Proposal submitted successfully for institutional verification',
                data: proposal,
            });
        }
        catch (error) {
            next(error);
        }
    };
    verifyInstitution = async (req, res, next) => {
        try {
            const { isApproved, comments } = req.body;
            if (isApproved === undefined) {
                throw new AppError_1.ValidationError('isApproved flag is required');
            }
            const userId = req.user?.id;
            const userName = req.user?.name || 'Institution Admin';
            const proposal = await this.proposalService.verifyInstitution(req.params.id, isApproved, comments || '', userId, userName);
            (0, response_1.sendResponse)({
                res,
                message: `Proposal marked as institutionally verified: ${isApproved}`,
                data: proposal,
            });
        }
        catch (error) {
            next(error);
        }
    };
    assignReviewer = async (req, res, next) => {
        try {
            const { reviewerId } = req.body;
            if (!reviewerId) {
                throw new AppError_1.ValidationError('reviewerId is required');
            }
            const userId = req.user?.id;
            const userName = req.user?.name || 'Admin';
            const proposal = await this.proposalService.assignReviewer(req.params.id, reviewerId, userId, userName);
            (0, response_1.sendResponse)({
                res,
                message: 'Reviewer allocated to evaluate proposal successfully',
                data: proposal,
            });
        }
        catch (error) {
            next(error);
        }
    };
    companyDecision = async (req, res, next) => {
        try {
            const { decision, comments } = req.body;
            if (!decision) {
                throw new AppError_1.ValidationError('decision is required');
            }
            const userId = req.user?.id;
            const userName = req.user?.name || 'Company Admin';
            const proposal = await this.proposalService.companyDecision(req.params.id, decision, comments || '', userId, userName);
            (0, response_1.sendResponse)({
                res,
                message: `Company decision updated to ${decision} successfully`,
                data: proposal,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getTimeline = async (req, res, next) => {
        try {
            const logs = await ActivityLog_1.default.find({ 'metadata.proposalId': req.params.proposalId })
                .sort({ createdAt: 1 })
                .exec();
            (0, response_1.sendResponse)({
                res,
                message: 'Proposal activity timeline log history retrieved',
                data: logs,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getAnalytics = async (req, res, next) => {
        try {
            const user = req.user;
            if (!user) {
                throw new AppError_1.AuthenticationError('Not authenticated');
            }
            const filter = { isDeleted: { $ne: true } };
            if (user.role === 'STUDENT') {
                filter.solverId = user.id;
            }
            else if (user.role === 'INDUSTRY_SPOC') {
                filter.companyId = user.id;
            }
            else if (user.role === 'REVIEWER') {
                filter.reviewerId = user.id;
            }
            const total = await Proposal_1.default.countDocuments(filter).exec();
            const accepted = await Proposal_1.default.countDocuments({ ...filter, status: 'ACCEPTED' }).exec();
            const rejected = await Proposal_1.default.countDocuments({ ...filter, status: 'REJECTED' }).exec();
            const pending = await Proposal_1.default.countDocuments({ ...filter, status: 'SUBMITTED' }).exec();
            (0, response_1.sendResponse)({
                res,
                message: 'Proposal analytics aggregated successfully',
                data: {
                    totalProposalsCount: total,
                    acceptedProposalsCount: accepted,
                    rejectedProposalsCount: rejected,
                    pendingProposalsCount: pending,
                    acceptanceRatePercentage: total > 0 ? Math.round((accepted / total) * 100) : 0,
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.ProposalController = ProposalController;
