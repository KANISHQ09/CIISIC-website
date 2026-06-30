import { Request, Response, NextFunction } from 'express';
import { AuditLogRepository } from './audit.repository';
import { sendResponse } from '../../shared/responses/response';
import { AuthenticationError } from '../../shared/errors/AppError';

export class AuditLogController {
  private readonly auditRepository: AuditLogRepository;

  constructor() {
    this.auditRepository = new AuditLogRepository();
  }

  public getLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this.auditRepository.paginate(
        {},
        { page, limit, sort: { createdAt: -1 } }
      );

      sendResponse({
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
    } catch (error) {
      next(error);
    }
  };

  public logAction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;
      if (!user) {
        throw new AuthenticationError('Not authenticated');
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

      sendResponse({
        res,
        statusCode: 201,
        message: 'Audit log entry created successfully',
        data: entry,
      });
    } catch (error) {
      next(error);
    }
  };
}
