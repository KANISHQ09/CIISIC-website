"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeModel = void 0;
const mongoose_1 = require("mongoose");
const ChallengeSchema = new mongoose_1.Schema({
    title: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    problemStatement: { type: String, required: true },
    objectives: { type: String, required: true },
    expectedDeliverables: { type: String, required: true },
    technologies: [{ type: String }],
    difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'], default: 'MEDIUM', index: true },
    duration: { type: String, required: true },
    budget: { type: String, required: true },
    companyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    status: {
        type: String,
        required: true,
        enum: [
            'DRAFT',
            'PENDING_APPROVAL',
            'PUBLISHED',
            'OPEN',
            'UNDER_REVIEW',
            'CLOSED',
            'ARCHIVED',
            'CANCELLED',
        ],
        default: 'DRAFT',
        index: true,
    },
    isFeatured: { type: Boolean, default: false, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: String },
    datasetLinks: [{ type: String }],
    submissionDeadline: { type: Date, required: true, index: true },
    visibility: { type: String, enum: ['PUBLIC', 'PRIVATE'], default: 'PUBLIC', index: true },
    cellId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ExcellenceCell', index: true },
    institutionScope: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Institution', index: true }],
    reviewerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', index: true },
    evaluationCriteria: { type: String },
    tags: [{ type: String, index: true }],
}, {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
});
// Compound indexes
ChallengeSchema.index({ status: 1, submissionDeadline: 1, isDeleted: 1 });
ChallengeSchema.index({ companyId: 1, status: 1, isDeleted: 1 });
ChallengeSchema.index({ cellId: 1, isFeatured: 1, isDeleted: 1 });
ChallengeSchema.index({ institutionScope: 1, status: 1, isDeleted: 1 });
exports.ChallengeModel = (0, mongoose_1.model)('Challenge', ChallengeSchema);
exports.default = exports.ChallengeModel;
