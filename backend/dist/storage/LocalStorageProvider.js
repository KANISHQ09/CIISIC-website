"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageProvider = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
class LocalStorageProvider {
    uploadDir;
    constructor() {
        this.uploadDir = path_1.default.join(__dirname, '../../uploads');
        fs_extra_1.default.ensureDirSync(this.uploadDir);
    }
    async upload(filePath, fileBuffer, mimeType) {
        const fullPath = path_1.default.join(this.uploadDir, filePath);
        await fs_extra_1.default.ensureDir(path_1.default.dirname(fullPath));
        await fs_extra_1.default.writeFile(fullPath, fileBuffer);
        return filePath; // Storage key
    }
    async delete(storageKey) {
        const fullPath = path_1.default.join(this.uploadDir, storageKey);
        if (await fs_extra_1.default.pathExists(fullPath)) {
            await fs_extra_1.default.remove(fullPath);
        }
    }
    async exists(storageKey) {
        const fullPath = path_1.default.join(this.uploadDir, storageKey);
        return fs_extra_1.default.pathExists(fullPath);
    }
    async generateSignedUrl(storageKey, expirySeconds = 3600) {
        // In local dev, return local serve route URL
        return `/api/v1/uploads/files/${storageKey}`;
    }
}
exports.LocalStorageProvider = LocalStorageProvider;
