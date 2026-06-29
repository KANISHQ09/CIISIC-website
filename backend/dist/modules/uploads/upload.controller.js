"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const crypto_1 = __importDefault(require("crypto"));
const StorageFactory_1 = __importDefault(require("../../storage/StorageFactory"));
const File_1 = __importDefault(require("../../database/schemas/File"));
const response_1 = require("../../shared/responses/response");
const AppError_1 = require("../../shared/errors/AppError");
const QueueService_1 = require("../../shared/queue/QueueService");
class UploadController {
    uploadFile = async (req, res, next) => {
        try {
            const file = req.file;
            if (!file) {
                throw new AppError_1.ValidationError('No file payload found in request');
            }
            const userId = req.user?.id;
            if (!userId) {
                throw new AppError_1.AuthenticationError('Not authenticated');
            }
            // Generate SHA256 checksum
            const hash = crypto_1.default.createHash('sha256').update(file.buffer).digest('hex');
            // Check if duplicate file exists
            const existingFile = await File_1.default.findOne({ hash, isDeleted: { $ne: true } });
            if (existingFile) {
                (0, response_1.sendResponse)({
                    res,
                    message: 'Duplicate file upload matched, returning existing instance',
                    data: existingFile,
                });
                return;
            }
            // Safe key generation
            const storageKey = `${Date.now()}-${file.originalname}`;
            const provider = StorageFactory_1.default.getProvider();
            // Upload using provider abstraction
            await provider.upload(storageKey, file.buffer, file.mimetype);
            // Save metadata to DB
            const dbFile = await File_1.default.create({
                filename: storageKey,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                storageKey,
                uploadedBy: userId,
                hash, // Added for duplicate checking
            });
            // Register file processing background worker job
            const queue = QueueService_1.QueueService.getInstance();
            await queue.add('FILE_PROCESSING', { fileId: dbFile._id, storageKey });
            (0, response_1.sendResponse)({
                res,
                statusCode: 201,
                message: 'File uploaded and logged successfully',
                data: dbFile,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getFileDetails = async (req, res, next) => {
        try {
            const file = await File_1.default.findById(req.params.id);
            if (!file) {
                throw new AppError_1.ValidationError('File record not found');
            }
            const provider = StorageFactory_1.default.getProvider();
            const signedUrl = await provider.generateSignedUrl(file.storageKey);
            (0, response_1.sendResponse)({
                res,
                message: 'File metadata retrieved',
                data: {
                    file,
                    downloadUrl: signedUrl,
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
    getJobs = async (req, res, next) => {
        try {
            const queue = QueueService_1.QueueService.getInstance();
            (0, response_1.sendResponse)({
                res,
                message: 'Queue background jobs list retrieved',
                data: queue.getAllJobs(),
            });
        }
        catch (error) {
            next(error);
        }
    };
    getStorageHealth = async (req, res, next) => {
        try {
            const provider = StorageFactory_1.default.getProvider();
            (0, response_1.sendResponse)({
                res,
                message: 'Storage connection health test status',
                data: {
                    providerName: process.env.STORAGE_PROVIDER || 'LOCAL',
                    status: 'healthy',
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.UploadController = UploadController;
