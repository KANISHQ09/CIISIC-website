"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationModel = void 0;
const mongoose_1 = require("mongoose");
const ConversationSchema = new mongoose_1.Schema({
    participants: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true }],
    type: {
        type: String,
        enum: ['PROPOSAL', 'CHALLENGE', 'SYSTEM'],
        default: 'PROPOSAL',
        index: true,
    },
    referenceId: { type: mongoose_1.Schema.Types.ObjectId, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
}, {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
});
exports.ConversationModel = (0, mongoose_1.model)('Conversation', ConversationSchema);
exports.default = exports.ConversationModel;
