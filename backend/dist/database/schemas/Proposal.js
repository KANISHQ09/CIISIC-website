"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalModel = void 0;
const mongoose_1 = require("mongoose");
const ProposalSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    abstract: { type: String, required: true },
    solverId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    challengeId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Challenge', required: true, index: true },
    companyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    institutionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Institution', required: true, index: true },
    teamMembers: [{ type: String }],
    approachDocument: { type: String },
    attachments: [{ type: String }],
    status: {
        type: String,
        required: true,
        enum: [
            'DRAFT',
            'SUBMITTED',
            'INSTITUTION_VERIFIED',
            'REVIEW_ASSIGNED',
            'UNDER_REVIEW',
            'REVIEW_COMPLETED',
            'INDUSTRY_REVIEW',
            'REVISION_REQUESTED',
            'ACCEPTED',
            'REJECTED',
            'COMPLETED',
            'WITHDRAWN',
        ],
        default: 'DRAFT',
        index: true,
    },
    proposalVersion: { type: Number, default: 1 },
    reviewerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', index: true },
    reviewScores: {
        innovation: { type: Number, default: 0 },
        technical: { type: Number, default: 0 },
        feasibility: { type: Number, default: 0 },
        scalability: { type: Number, default: 0 },
        documentation: { type: Number, default: 0 },
        businessImpact: { type: Number, default: 0 },
        weightedScore: { type: Number, default: 0 },
    },
    decisionHistory: [
        {
            status: { type: String },
            actionBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            comments: { type: String },
            timestamp: { type: Date, default: Date.now },
        },
    ],
    versionHistory: [
        {
            version: { type: Number },
            snapshot: { type: String },
            modifiedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            timestamp: { type: Date, default: Date.now },
        },
    ],
    comments: [
        {
            authorName: { type: String, required: true },
            authorRole: { type: String, required: true },
            content: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        },
    ],
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: String },
}, {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
});
// Compound indexes
ProposalSchema.index({ solverId: 1, challengeId: 1 }, { unique: true });
ProposalSchema.index({ reviewerId: 1, status: 1, isDeleted: 1 });
ProposalSchema.index({ institutionId: 1, status: 1, isDeleted: 1 });
ProposalSchema.index({ companyId: 1, status: 1, isDeleted: 1 });
exports.ProposalModel = (0, mongoose_1.model)('Proposal', ProposalSchema);
exports.default = exports.ProposalModel;
