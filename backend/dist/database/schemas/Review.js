"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModel = void 0;
const mongoose_1 = require("mongoose");
const ReviewSchema = new mongoose_1.Schema({
    proposalId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Proposal', required: true, index: true },
    innovationScore: { type: Number, required: true, min: 1, max: 10 },
    technicalScore: { type: Number, required: true, min: 1, max: 10, default: 5 },
    feasibilityScore: { type: Number, required: true, min: 1, max: 10 },
    scalabilityScore: { type: Number, required: true, min: 1, max: 10, default: 5 },
    documentationScore: { type: Number, required: true, min: 1, max: 10 },
    businessImpactScore: { type: Number, required: true, min: 1, max: 10, default: 5 },
    totalScore: { type: Number, required: true },
    comments: { type: String, required: true },
    recommendation: {
        type: String,
        required: true,
        enum: ['APPROVED', 'REVISING', 'REJECTED'],
        index: true,
    },
    evaluatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    confidentialNotes: { type: String },
    publicFeedback: { type: String },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
}, {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
});
ReviewSchema.index({ recommendation: 1, totalScore: -1, isDeleted: 1 });
exports.ReviewModel = (0, mongoose_1.model)('Review', ReviewSchema);
exports.default = exports.ReviewModel;
