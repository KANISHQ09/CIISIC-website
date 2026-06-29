"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CMSPageModel = void 0;
const mongoose_1 = require("mongoose");
const CMSPageSchema = new mongoose_1.Schema({
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    content: { type: String, default: '' },
    sections: [{ name: String, value: mongoose_1.Schema.Types.Mixed }],
    isPublished: { type: Boolean, default: false, index: true },
}, {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
});
exports.CMSPageModel = (0, mongoose_1.model)('CMSPage', CMSPageSchema);
exports.default = exports.CMSPageModel;
