"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalService = void 0;
const proposal_repository_1 = require("./proposal.repository");
const Proposal_1 = __importDefault(require("../../database/schemas/Proposal"));
const AppError_1 = require("../../shared/errors/AppError");
const AuditLog_1 = __importDefault(require("../../database/schemas/AuditLog"));
const ActivityLog_1 = __importDefault(require("../../database/schemas/ActivityLog"));
const Notification_1 = __importDefault(require("../../database/schemas/Notification"));
const Challenge_1 = __importDefault(require("../../database/schemas/Challenge"));
const User_1 = __importDefault(require("../../database/schemas/User"));
const EventBus_1 = require("../../events/EventBus");
class ProposalService {
    proposalRepository;
    constructor() {
        this.proposalRepository = new proposal_repository_1.ProposalRepository();
    }
    async createDraft(data, userId, userName) {
        const challenge = await Challenge_1.default.findById(data.challengeId);
        if (!challenge) {
            throw new AppError_1.NotFoundError('Challenge statement not found');
        }
        const solver = await User_1.default.findById(userId);
        if (!solver) {
            throw new AppError_1.NotFoundError('Solver account not found');
        }
        const proposal = await this.proposalRepository.create({
            ...data,
            solverId: userId,
            companyId: challenge.companyId,
            status: 'DRAFT',
            proposalVersion: 1,
            decisionHistory: [],
            versionHistory: [],
        });
        await ActivityLog_1.default.create({
            userId,
            event: 'PROPOSAL_DRAFT_CREATED',
            metadata: { proposalId: proposal._id, challengeId: challenge._id },
        });
        return proposal;
    }
    async getProposalById(id) {
        const proposal = await Proposal_1.default.findById(id)
            .populate('challengeId')
            .populate('companyId')
            .populate('solverId')
            .populate('reviewerId')
            .exec();
        if (!proposal) {
            throw new AppError_1.NotFoundError('Proposal not found');
        }
        return proposal;
    }
    async getProposals(filter = {}) {
        return Proposal_1.default.find(filter)
            .populate('challengeId')
            .populate('companyId')
            .populate('solverId')
            .sort({ createdAt: -1 })
            .exec();
    }
    async submitProposal(id, userId, userName) {
        const proposal = await this.proposalRepository.findById(id);
        if (!proposal) {
            throw new AppError_1.NotFoundError('Proposal not found');
        }
        if (proposal.status !== 'DRAFT' && proposal.status !== 'REVISION_REQUESTED') {
            throw new AppError_1.ValidationError('Only proposal drafts or revision requests can be submitted');
        }
        proposal.status = 'SUBMITTED';
        proposal.decisionHistory.push({
            status: 'SUBMITTED',
            actionBy: userId,
            comments: 'Proposal submitted by solver',
            timestamp: new Date(),
        });
        // Save previous snapshot version history
        proposal.versionHistory.push({
            version: proposal.proposalVersion,
            snapshot: JSON.stringify({ title: proposal.title, abstract: proposal.abstract }),
            modifiedBy: userId,
            timestamp: new Date(),
        });
        proposal.proposalVersion += 1;
        await proposal.save();
        // Trigger Notification for Institution SPOC to verify
        await Notification_1.default.create({
            userId: proposal.solverId, // Also notify student
            type: 'SUCCESS',
            category: 'PROPOSAL',
            priority: 'MEDIUM',
            title: 'Proposal Submitted Successfully',
            content: `Your proposal "${proposal.title}" has been submitted and is awaiting institutional verification.`,
            deepLink: `/portal/student/proposals/${proposal._id}`,
        });
        // Activity Timeline Entry
        await ActivityLog_1.default.create({
            userId,
            event: 'PROPOSAL_SUBMITTED',
            metadata: { proposalId: proposal._id },
        });
        // Audit Log Entry
        await AuditLog_1.default.create({
            userId,
            userName,
            action: 'PROPOSAL_SUBMITTED',
            description: `Proposal "${proposal.title}" submitted by student solver`,
            ipAddress: '0.0.0.0',
            category: 'APPROVAL',
        });
        // Publish to Domain EventBus
        await EventBus_1.EventBus.getInstance().publish('PROPOSAL_SUBMITTED', {
            proposalId: proposal._id,
            solverId: proposal.solverId,
        });
        return proposal;
    }
    async verifyInstitution(id, isApproved, comments, userId, userName) {
        const proposal = await this.proposalRepository.findById(id);
        if (!proposal) {
            throw new AppError_1.NotFoundError('Proposal not found');
        }
        if (proposal.status !== 'SUBMITTED') {
            throw new AppError_1.ValidationError('Only submitted proposals can be verified by institutions');
        }
        const nextStatus = isApproved ? 'INSTITUTION_VERIFIED' : 'REJECTED';
        proposal.status = nextStatus;
        proposal.decisionHistory.push({
            status: nextStatus,
            actionBy: userId,
            comments,
            timestamp: new Date(),
        });
        await proposal.save();
        // Notify Student
        await Notification_1.default.create({
            userId: proposal.solverId,
            type: isApproved ? 'SUCCESS' : 'ALERT',
            category: 'PROPOSAL',
            priority: 'HIGH',
            title: isApproved ? 'Proposal Institutionally Verified' : 'Proposal Rejected by Institution',
            content: isApproved
                ? `Your proposal "${proposal.title}" has been verified by LNCT and is awaiting reviewer allocation.`
                : `Your proposal "${proposal.title}" was rejected: ${comments}`,
            deepLink: `/portal/student/proposals/${proposal._id}`,
        });
        await ActivityLog_1.default.create({
            userId,
            event: isApproved ? 'PROPOSAL_INSTITUTION_VERIFIED' : 'PROPOSAL_INSTITUTION_REJECTED',
            metadata: { proposalId: proposal._id },
        });
        // Publish to Domain EventBus
        await EventBus_1.EventBus.getInstance().publish('PROPOSAL_INSTITUTION_VERIFIED', {
            proposalId: proposal._id,
            solverId: proposal.solverId,
        });
        return proposal;
    }
    async assignReviewer(id, reviewerId, userId, userName) {
        const proposal = await this.proposalRepository.findById(id);
        if (!proposal) {
            throw new AppError_1.NotFoundError('Proposal not found');
        }
        proposal.status = 'REVIEW_ASSIGNED';
        proposal.reviewerId = reviewerId;
        proposal.decisionHistory.push({
            status: 'REVIEW_ASSIGNED',
            actionBy: userId,
            comments: `Reviewer assigned by administrator`,
            timestamp: new Date(),
        });
        await proposal.save();
        // Notify Reviewer
        await Notification_1.default.create({
            userId: reviewerId,
            type: 'INFO',
            category: 'REVIEW',
            priority: 'HIGH',
            title: 'New Evaluation Review Allocated',
            content: `You have been assigned to evaluate proposal: "${proposal.title}"`,
            deepLink: `/portal/reviewer/proposals/${proposal._id}`,
        });
        await ActivityLog_1.default.create({
            userId,
            event: 'PROPOSAL_REVIEWER_ASSIGNED',
            metadata: { proposalId: proposal._id, reviewerId },
        });
        return proposal;
    }
    async companyDecision(id, decision, comments, userId, userName) {
        const proposal = await this.proposalRepository.findById(id);
        if (!proposal) {
            throw new AppError_1.NotFoundError('Proposal not found');
        }
        proposal.status = decision;
        proposal.decisionHistory.push({
            status: decision,
            actionBy: userId,
            comments,
            timestamp: new Date(),
        });
        await proposal.save();
        // Notify Student
        await Notification_1.default.create({
            userId: proposal.solverId,
            type: decision === 'ACCEPTED' ? 'SUCCESS' : 'ALERT',
            category: 'PROPOSAL',
            priority: 'HIGH',
            title: `Proposal ${decision}`,
            content: `Industry decision made on your proposal "${proposal.title}": ${decision}`,
            deepLink: `/portal/student/proposals/${proposal._id}`,
        });
        await ActivityLog_1.default.create({
            userId,
            event: `PROPOSAL_INDUSTRY_${decision}`,
            metadata: { proposalId: proposal._id },
        });
        return proposal;
    }
}
exports.ProposalService = ProposalService;
