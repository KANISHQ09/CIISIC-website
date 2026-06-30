"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactMessageModel = void 0;
const mongoose_1 = require("mongoose");
const ContactMessageSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
}, { timestamps: true });
exports.ContactMessageModel = (0, mongoose_1.model)('ContactMessage', ContactMessageSchema);
exports.default = exports.ContactMessageModel;
