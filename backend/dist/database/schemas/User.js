"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: ['STUDENT', 'INDUSTRY_SPOC', 'INSTITUTION_SPOC', 'REVIEWER', 'SUPER_ADMIN'],
        index: true,
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    isDeleted: { type: Boolean, default: false, index: true },
    isSuspended: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: { type: String },
    createdBy: { type: String },
    updatedBy: { type: String },
}, {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
});
// Compound index for filtering active users by role
UserSchema.index({ role: 1, isDeleted: 1 });
exports.UserModel = (0, mongoose_1.model)('User', UserSchema);
exports.default = exports.UserModel;
