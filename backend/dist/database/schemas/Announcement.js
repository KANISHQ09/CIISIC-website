"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementModel = void 0;
const mongoose_1 = require("mongoose");
const AnnouncementSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ['GENERAL', 'CHALLENGE', 'SYSTEM', 'EVENT'],
        index: true,
    },
    targetRoles: [{ type: String }],
    isPinned: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: false, index: true },
}, {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
});
exports.AnnouncementModel = (0, mongoose_1.model)('Announcement', AnnouncementSchema);
exports.default = exports.AnnouncementModel;
