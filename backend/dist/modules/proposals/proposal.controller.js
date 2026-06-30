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
const Company_1 = __importDefault(require("../../database/schemas/Company"));
const Institution_1 = __importDefault(require("../../database/schemas/Institution"));
const mongoose_1 = __importDefault(require("mongoose"));
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
            const filter = { isDeleted: { $ne: true } };
            if (user.role === 'STUDENT') {
                filter.solverId = user.id;
            }
            else if (user.role === 'INDUSTRY_SPOC') {
                const company = await Company_1.default.findOne({ industrySpocs: user.id });
                if (company) {
                    filter.companyId = company._id;
                }
                else {
                    filter.companyId = new mongoose_1.default.Types.ObjectId(); // force empty if no company
                }
            }
            else if (user.role === 'INSTITUTION_SPOC' || user.role === 'REVIEWER') {
                const inst = await Institution_1.default.findOne({
                    $or: [{ primarySpoc: user.id }, { facultyMembers: user.id }]
                });
                if (inst) {
                    filter.institutionId = inst._id;
                }
                else if (user.role === 'REVIEWER') {
                    filter.reviewerId = user.id;
                }
                else {
                    filter.institutionId = new mongoose_1.default.Types.ObjectId();
                }
            }
            const proposals = await this.proposalService.getProposals(filter);
            // Anonymize if user is reviewer
            const sanitized = proposals.map((p) => {
                const pObj = p.toObject();
                if (user.role === 'REVIEWER') {
                    pObj.solverId = undefined;
                    if (pObj.studentName)
                        pObj.studentName = 'Anonymized Solver';
                }
                return pObj;
            });
            (0, response_1.sendResponse)({
                res,
                message: 'Proposals list retrieved successfully',
                data: sanitized,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getProposalById = async (req, res, next) => {
        try {
            const user = req.user;
            if (!user) {
                throw new AppError_1.AuthenticationError('Not authenticated');
            }
            const proposal = await this.proposalService.getProposalById(req.params.id);
            if (!proposal) {
                throw new AppError_1.NotFoundError('Proposal not found');
            }
            // Enforce data isolation / RBAC logic
            let hasAccess = false;
            if (user.role === 'SUPER_ADMIN') {
                hasAccess = true;
            }
            else if (user.role === 'STUDENT' && proposal.solverId._id.toString() === user.id) {
                hasAccess = true;
            }
            else if (user.role === 'REVIEWER' && proposal.reviewerId?._id.toString() === user.id) {
                hasAccess = true;
            }
            else if (user.role === 'INDUSTRY_SPOC') {
                const company = await Company_1.default.findOne({ _id: proposal.companyId._id, industrySpocs: user.id });
                if (company)
                    hasAccess = true;
            }
            else if (user.role === 'INSTITUTION_SPOC') {
                const inst = await Institution_1.default.findOne({
                    _id: proposal.institutionId._id,
                    $or: [{ primarySpoc: user.id }, { facultyMembers: user.id }]
                });
                if (inst)
                    hasAccess = true;
            }
            if (!hasAccess) {
                throw new AppError_1.AuthorizationError('Forbidden: Access is denied to this proposal');
            }
            const proposalObj = proposal.toObject();
            if (user.role === 'REVIEWER') {
                proposalObj.solverId = undefined;
                proposalObj.studentName = 'Anonymized Solver';
            }
            (0, response_1.sendResponse)({
                res,
                message: 'Proposal details retrieved successfully',
                data: proposalObj,
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
            const proposal = await Proposal_1.default.findById(req.params.id);
            if (!proposal) {
                throw new AppError_1.NotFoundError('Proposal not found');
            }
            if (proposal.solverId.toString() !== userId) {
                throw new AppError_1.AuthorizationError('Forbidden: You can only submit your own proposals');
            }
            const updated = await this.proposalService.submitProposal(req.params.id, userId, userName);
            (0, response_1.sendResponse)({
                res,
                message: 'Proposal submitted successfully for institutional verification',
                data: updated,
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
            const user = req.user;
            if (!user) {
                throw new AppError_1.AuthenticationError('Not authenticated');
            }
            const proposal = await Proposal_1.default.findById(req.params.id);
            if (!proposal) {
                throw new AppError_1.NotFoundError('Proposal not found');
            }
            if (user.role !== 'SUPER_ADMIN') {
                const inst = await Institution_1.default.findOne({
                    _id: proposal.institutionId,
                    $or: [{ primarySpoc: user.id }, { facultyMembers: user.id }]
                });
                if (!inst) {
                    throw new AppError_1.AuthorizationError('Forbidden: You are not authorized to verify this proposal');
                }
            }
            const updated = await this.proposalService.verifyInstitution(req.params.id, isApproved, comments || '', user.id, user.name);
            (0, response_1.sendResponse)({
                res,
                message: `Proposal marked as institutionally verified: ${isApproved}`,
                data: updated,
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
            const user = req.user;
            if (!user) {
                throw new AppError_1.AuthenticationError('Not authenticated');
            }
            const proposal = await Proposal_1.default.findById(req.params.id);
            if (!proposal) {
                throw new AppError_1.NotFoundError('Proposal not found');
            }
            if (user.role !== 'SUPER_ADMIN') {
                const company = await Company_1.default.findOne({ _id: proposal.companyId, industrySpocs: user.id });
                if (!company) {
                    throw new AppError_1.AuthorizationError('Forbidden: You are not authorized to make decisions on this proposal');
                }
            }
            const updated = await this.proposalService.companyDecision(req.params.id, decision, comments || '', user.id, user.name);
            (0, response_1.sendResponse)({
                res,
                message: `Company decision updated to ${decision} successfully`,
                data: updated,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getTimeline = async (req, res, next) => {
        try {
            const user = req.user;
            if (!user) {
                throw new AppError_1.AuthenticationError('Not authenticated');
            }
            const proposal = await Proposal_1.default.findById(req.params.id || req.params.proposalId);
            if (!proposal) {
                throw new AppError_1.NotFoundError('Proposal not found');
            }
            let hasAccess = false;
            if (user.role === 'SUPER_ADMIN') {
                hasAccess = true;
            }
            else if (user.role === 'STUDENT' && proposal.solverId.toString() === user.id) {
                hasAccess = true;
            }
            else if (user.role === 'REVIEWER' && proposal.reviewerId?.toString() === user.id) {
                hasAccess = true;
            }
            else if (user.role === 'INDUSTRY_SPOC') {
                const company = await Company_1.default.findOne({ _id: proposal.companyId, industrySpocs: user.id });
                if (company)
                    hasAccess = true;
            }
            else if (user.role === 'INSTITUTION_SPOC') {
                const inst = await Institution_1.default.findOne({
                    _id: proposal.institutionId,
                    $or: [{ primarySpoc: user.id }, { facultyMembers: user.id }]
                });
                if (inst)
                    hasAccess = true;
            }
            if (!hasAccess) {
                throw new AppError_1.AuthorizationError('Forbidden: Access is denied to this timeline');
            }
            const logs = await ActivityLog_1.default.find({ 'metadata.proposalId': req.params.proposalId || req.params.id })
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
                const company = await Company_1.default.findOne({ industrySpocs: user.id });
                if (company)
                    filter.companyId = company._id;
            }
            else if (user.role === 'INSTITUTION_SPOC' || user.role === 'REVIEWER') {
                const inst = await Institution_1.default.findOne({
                    $or: [{ primarySpoc: user.id }, { facultyMembers: user.id }]
                });
                if (inst) {
                    filter.institutionId = inst._id;
                }
                else if (user.role === 'REVIEWER') {
                    filter.reviewerId = user.id;
                }
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
    addComment = async (req, res, next) => {
        try {
            const { content } = req.body;
            if (!content) {
                throw new AppError_1.ValidationError('content is required');
            }
            const user = req.user;
            if (!user) {
                throw new AppError_1.AuthenticationError('Not authenticated');
            }
            const proposal = await Proposal_1.default.findById(req.params.id);
            if (!proposal) {
                throw new AppError_1.NotFoundError('Proposal not found');
            }
            let hasAccess = false;
            if (user.role === 'SUPER_ADMIN') {
                hasAccess = true;
            }
            else if (user.role === 'STUDENT' && proposal.solverId.toString() === user.id) {
                hasAccess = true;
            }
            else if (user.role === 'REVIEWER' && proposal.reviewerId?.toString() === user.id) {
                hasAccess = true;
            }
            else if (user.role === 'INDUSTRY_SPOC') {
                const company = await Company_1.default.findOne({ _id: proposal.companyId, industrySpocs: user.id });
                if (company)
                    hasAccess = true;
            }
            else if (user.role === 'INSTITUTION_SPOC') {
                const inst = await Institution_1.default.findOne({
                    _id: proposal.institutionId,
                    $or: [{ primarySpoc: user.id }, { facultyMembers: user.id }]
                });
                if (inst)
                    hasAccess = true;
            }
            if (!hasAccess) {
                throw new AppError_1.AuthorizationError('Forbidden: Access is denied to comment on this proposal');
            }
            proposal.comments.push({
                authorName: user.name,
                authorRole: user.role === 'STUDENT' ? 'Student' : user.role,
                content,
                createdAt: new Date(),
            });
            await proposal.save();
            (0, response_1.sendResponse)({
                res,
                message: 'Comment posted successfully',
                data: proposal,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.ProposalController = ProposalController;
