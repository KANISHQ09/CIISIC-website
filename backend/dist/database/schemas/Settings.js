"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsModel = void 0;
const mongoose_1 = require("mongoose");
const SettingsSchema = new mongoose_1.Schema({
    key: { type: String, required: true, unique: true, index: true },
    value: { type: mongoose_1.Schema.Types.Mixed, required: true },
    description: { type: String },
    category: {
        type: String,
        required: true,
        enum: ['BRANDING', 'SECURITY', 'UPLOAD_LIMITS', 'EMAIL'],
        index: true,
    },
}, {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
});
exports.SettingsModel = (0, mongoose_1.model)('Settings', SettingsSchema);
exports.default = exports.SettingsModel;
