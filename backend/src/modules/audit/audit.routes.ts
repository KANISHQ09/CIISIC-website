import { Router } from 'express';
import { AuditLogController } from './audit.controller';
import { authenticate, requireRole } from '../../shared/middleware/authMiddleware';

const router = Router();
const controller = new AuditLogController();

router.get(
  '/',
  authenticate as any,
  requireRole(['SUPER_ADMIN']) as any,
  controller.getLogs,
);

router.post(
  '/',
  authenticate as any,
  controller.logAction,
);

export default router;
