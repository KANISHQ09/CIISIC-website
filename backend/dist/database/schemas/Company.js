"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyModel = void 0;
const mongoose_1 = require("mongoose");
const CompanySchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, index: true },
    industry: { type: String, required: true },
    websiteUrl: { type: String },
    logo: { type: String },
    description: { type: String },
    address: { type: String },
    gst: { type: String },
    verificationStatus: {
        type: String,
        enum: ['PENDING', 'VERIFIED', 'REJECTED'],
        default: 'PENDING',
        index: true,
    },
    isCIIMember: { type: Boolean, default: false },
    industrySpocs: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    hiringStatus: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE', index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: String },
}, {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
});
exports.CompanyModel = (0, mongoose_1.model)('Company', CompanySchema);
exports.default = exports.CompanyModel;
