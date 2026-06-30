"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformPermissionModel = void 0;
const mongoose_1 = require("mongoose");
const PlatformPermissionSchema = new mongoose_1.Schema({
    key: { type: String, required: true, unique: true, index: true },
    label: { type: String, required: true },
    allowedRoles: [{ type: String }],
});
exports.PlatformPermissionModel = (0, mongoose_1.model)('PlatformPermission', PlatformPermissionSchema);
exports.default = exports.PlatformPermissionModel;
