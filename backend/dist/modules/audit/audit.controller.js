"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogController = void 0;
const audit_repository_1 = require("./audit.repository");
const response_1 = require("../../shared/responses/response");
const AppError_1 = require("../../shared/errors/AppError");
class AuditLogController {
    auditRepository;
    constructor() {
        this.auditRepository = new audit_repository_1.AuditLogRepository();
    }
    getLogs = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const result = await this.auditRepository.paginate({}, { page, limit, sort: { createdAt: -1 } });
            (0, response_1.sendResponse)({
                res,
                message: 'Audit logs retrieved successfully',
                data: result.docs,
                meta: {
                    totalDocs: result.totalDocs,
                    limit: result.limit,
                    page: result.page,
                    totalPages: result.totalPages,
                }
            });
        }
        catch (error) {
            next(error);
        }
    };
    logAction = async (req, res, next) => {
        try {
            const user = req.user;
            if (!user) {
                throw new AppError_1.AuthenticationError('Not authenticated');
            }
            const { action, description, category } = req.body;
            const ipAddress = req.ip || '0.0.0.0';
            const entry = await this.auditRepository.create({
                userId: user.id,
                userName: user.name,
                action,
                description,
                ipAddress,
                category: category || 'SYSTEM',
            });
            (0, response_1.sendResponse)({
                res,
                statusCode: 201,
                message: 'Audit log entry created successfully',
                data: entry,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AuditLogController = AuditLogController;
