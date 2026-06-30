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
    projects: [
        {
            title: { type: String },
            description: { type: String },
            link: { type: String }
        }
    ],
    education: [
        {
            institution: { type: String },
            degree: { type: String },
            year: { type: String }
        }
    ],
    resumeUrl: { type: String },
    resumeName: { type: String },
    portfolioUrl: { type: String },
    socialLinks: {
        github: { type: String },
        linkedin: { type: String },
        twitter: { type: String }
    },
    completionPercentage: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    rank: { type: Number, default: 0 },
    bookmarkedChallenges: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Challenge' }],
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
