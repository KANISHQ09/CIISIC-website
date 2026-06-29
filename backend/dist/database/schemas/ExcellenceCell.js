"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcellenceCellModel = void 0;
const mongoose_1 = require("mongoose");
const ExcellenceCellSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    theme: { type: String, required: true },
    description: { type: String, required: true },
    banner: { type: String },
    icon: { type: String },
    hostInstitutionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Institution',
        required: true,
        index: true,
    },
    facultySpocs: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', index: true }],
    industryPartners: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Company', index: true }],
    status: { type: String, enum: ['ACTIVE', 'ARCHIVED'], default: 'ACTIVE', index: true },
    visibility: { type: String, enum: ['PUBLIC', 'PRIVATE'], default: 'PUBLIC', index: true },
    researchDomain: { type: String, required: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: String },
}, {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
});
// Compound index for domain filtering per institution
ExcellenceCellSchema.index({ hostInstitutionId: 1, researchDomain: 1, isDeleted: 1 });
ExcellenceCellSchema.index({ status: 1, visibility: 1, isDeleted: 1 });
exports.ExcellenceCellModel = (0, mongoose_1.model)('ExcellenceCell', ExcellenceCellSchema);
exports.default = exports.ExcellenceCellModel;
