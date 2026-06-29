import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { authenticate, requireRole } from '../../shared/middleware/authMiddleware';

const router = Router();
const controller = new AnalyticsController();

// Protected Analytics endpoints
router.get(
  '/dashboard',
  authenticate as any,
  requireRole(['SUPER_ADMIN', 'INSTITUTION_SPOC', 'INDUSTRY_SPOC']) as any,
  controller.getDashboardStats,
);

export default router;
