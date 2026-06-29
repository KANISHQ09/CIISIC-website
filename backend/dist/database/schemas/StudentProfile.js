"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentProfileModel = void 0;
const mongoose_1 = require("mongoose");
const StudentProfileSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    enrollmentNo: { type: String, required: true, unique: true, index: true },
    institutionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Institution', required: true, index: true },
    department: { type: String, required: true },
    yearOfStudy: { type: Number, required: true },
    skills: [{ type: String }],
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: String },
}, {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
});
// Compound index for department and year of study filters
StudentProfileSchema.index({ department: 1, yearOfStudy: 1, isDeleted: 1 });
exports.StudentProfileModel = (0, mongoose_1.model)('StudentProfile', StudentProfileSchema);
exports.default = exports.StudentProfileModel;
