"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogModel = void 0;
const mongoose_1 = require("mongoose");
const ActivityLogSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    event: { type: String, required: true, index: true },
    metadata: { type: mongoose_1.Schema.Types.Mixed },
    isDeleted: { type: Boolean, default: false, index: true },
}, {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
});
exports.ActivityLogModel = (0, mongoose_1.model)('ActivityLog', ActivityLogSchema);
exports.default = exports.ActivityLogModel;
