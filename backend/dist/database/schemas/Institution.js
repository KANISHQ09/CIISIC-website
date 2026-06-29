"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutionModel = void 0;
const mongoose_1 = require("mongoose");
const InstitutionSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true, index: true },
    location: { type: String, required: true },
    universityType: { type: String, required: true, default: 'Private' },
    city: { type: String, required: true, index: true },
    state: { type: String, required: true, index: true },
    address: { type: String, required: true },
    website: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    logo: { type: String },
    banner: { type: String },
    verificationStatus: {
        type: String,
        enum: ['PENDING', 'VERIFIED', 'SUSPENDED'],
        default: 'PENDING',
        index: true,
    },
    primarySpoc: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', index: true },
    facultyMembers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    departments: [{ type: String }],
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: String },
}, {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
});
exports.InstitutionModel = (0, mongoose_1.model)('Institution', InstitutionSchema);
exports.default = exports.InstitutionModel;
