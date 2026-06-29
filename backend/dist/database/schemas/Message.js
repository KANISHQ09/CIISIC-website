"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    conversationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
        index: true,
    },
    senderId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
}, {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
});
// Compound index to speed up message retrieval inside conversation
MessageSchema.index({ conversationId: 1, createdAt: 1, isDeleted: 1 });
exports.MessageModel = (0, mongoose_1.model)('Message', MessageSchema);
exports.default = exports.MessageModel;
