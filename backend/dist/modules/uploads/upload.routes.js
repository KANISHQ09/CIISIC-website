"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const upload_controller_1 = require("./upload.controller");
const authMiddleware_1 = require("../../shared/middleware/authMiddleware");
const router = (0, express_1.Router)();
const controller = new upload_controller_1.UploadController();
// Configure Multer in-memory storage with size limits
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024, // Max dataset file size (100MB)
    },
});
// Protected Upload endpoints
router.post('/', authMiddleware_1.authenticate, upload.single('file'), controller.uploadFile);
router.get('/jobs', authMiddleware_1.authenticate, controller.getJobs);
router.get('/health/storage', authMiddleware_1.authenticate, controller.getStorageHealth);
router.get('/:id', authMiddleware_1.authenticate, controller.getFileDetails);
exports.default = router;
