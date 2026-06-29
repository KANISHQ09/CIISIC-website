"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true, enum: ['INFO', 'WARNING', 'ALERT', 'SUCCESS'] },
    category: {
        type: String,
        required: true,
        enum: ['PROPOSAL', 'REVIEW', 'CHALLENGE', 'SYSTEM'],
        default: 'SYSTEM',
        index: true,
    },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW', index: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    deepLink: { type: String },
    isRead: { type: Boolean, default: false, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
}, {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
});
// Compound index
NotificationSchema.index({ userId: 1, isRead: 1, isDeleted: 1 });
exports.NotificationModel = (0, mongoose_1.model)('Notification', NotificationSchema);
exports.default = exports.NotificationModel;
