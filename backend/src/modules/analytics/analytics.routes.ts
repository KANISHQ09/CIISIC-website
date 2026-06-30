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

router.get(
  '/admin-dashboard',
  authenticate as any,
  requireRole(['SUPER_ADMIN']) as any,
  controller.getAdminDashboard,
);

router.get(
  '/leaderboard',
  authenticate as any,
  controller.getLeaderboard,
);

router.get(
  '/badges',
  authenticate as any,
  controller.getStudentBadges,
);

router.get(
  '/institution-dashboard',
  authenticate as any,
  requireRole(['INSTITUTION_SPOC', 'SUPER_ADMIN']) as any,
  controller.getInstitutionDashboard,
);

router.get(
  '/industry-dashboard',
  authenticate as any,
  requireRole(['INDUSTRY_SPOC', 'SUPER_ADMIN']) as any,
  controller.getIndustryDashboard,
);

export default router;
