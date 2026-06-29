"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3StorageProvider = void 0;
class S3StorageProvider {
    async upload(filePath, fileBuffer, mimeType) {
        // Stub implementation returning remote S3 bucket Key
        return `s3://ciisic-bucket/${filePath}`;
    }
    async delete(storageKey) {
        // Stub operation
    }
    async exists(storageKey) {
        return true;
    }
    async generateSignedUrl(storageKey, expirySeconds = 3600) {
        return `https://s3.amazonaws.com/ciisic-bucket/${storageKey}?signature=stub`;
    }
}
exports.S3StorageProvider = S3StorageProvider;
