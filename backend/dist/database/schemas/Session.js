"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionModel = void 0;
const mongoose_1 = require("mongoose");
const SessionSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    token: { type: String, required: true, unique: true, index: true },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
}, {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
});
exports.SessionModel = (0, mongoose_1.model)('Session', SessionSchema);
exports.default = exports.SessionModel;
