"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogModel = void 0;
const mongoose_1 = require("mongoose");
const AuditLogSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userName: { type: String, required: true },
    action: { type: String, required: true, index: true },
    description: { type: String, required: true },
    ipAddress: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ['AUTH', 'APPROVAL', 'SETTINGS', 'ACCESS', 'SYSTEM'],
        index: true,
    },
    isDeleted: { type: Boolean, default: false, index: true },
}, {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
});
// Compound index for querying log actions by category and date
AuditLogSchema.index({ category: 1, createdAt: -1, isDeleted: 1 });
exports.AuditLogModel = (0, mongoose_1.model)('AuditLog', AuditLogSchema);
exports.default = exports.AuditLogModel;
