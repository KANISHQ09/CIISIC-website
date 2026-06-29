"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogRepository = void 0;
const BaseRepository_1 = require("../../shared/repositories/BaseRepository");
const AuditLog_1 = require("../../database/schemas/AuditLog");
class AuditLogRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(AuditLog_1.AuditLogModel);
    }
}
exports.AuditLogRepository = AuditLogRepository;
