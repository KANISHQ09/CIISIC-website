"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageFactory = void 0;
const LocalStorageProvider_1 = require("./LocalStorageProvider");
const S3StorageProvider_1 = require("./S3StorageProvider");
class StorageFactory {
    static getProvider() {
        const provider = process.env.STORAGE_PROVIDER || 'LOCAL';
        if (provider === 'S3') {
            return new S3StorageProvider_1.S3StorageProvider();
        }
        return new LocalStorageProvider_1.LocalStorageProvider();
    }
}
exports.StorageFactory = StorageFactory;
exports.default = StorageFactory;
