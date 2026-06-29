"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileModel = void 0;
const mongoose_1 = require("mongoose");
const FileSchema = new mongoose_1.Schema({
    filename: { type: String, required: true, unique: true, index: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    storageKey: { type: String, required: true },
    uploadedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    hash: { type: String, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
}, {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
});
exports.FileModel = (0, mongoose_1.model)('File', FileSchema);
exports.default = exports.FileModel;
