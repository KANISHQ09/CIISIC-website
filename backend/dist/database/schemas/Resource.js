"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceModel = void 0;
const mongoose_1 = require("mongoose");
const ResourceSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    fileId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'File', index: true },
    category: {
        type: String,
        required: true,
        enum: ['GUIDELINE', 'TEMPLATE', 'POLICY', 'TUTORIAL'],
        index: true,
    },
    isPublic: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
}, {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
});
exports.ResourceModel = (0, mongoose_1.model)('Resource', ResourceSchema);
exports.default = exports.ResourceModel;
