import { Router } from 'express';
import { CompanyController } from './company.controller';
import { authenticate, requireRole } from '../../shared/middleware/authMiddleware';

const router = Router();
const controller = new CompanyController();

// Public Company Directory
router.get('/my', authenticate as any, controller.getMyCompany);
router.get('/', controller.getCompanies);
router.get('/:id', controller.getCompanyById);

// Protected Company Management
router.post(
  '/',
  authenticate as any,
  requireRole(['SUPER_ADMIN']) as any,
  controller.createCompany,
);
router.patch(
  '/:id',
  authenticate as any,
  requireRole(['SUPER_ADMIN', 'INDUSTRY_SPOC']) as any,
  controller.updateCompany,
);
router.post(
  '/:id/verify',
  authenticate as any,
  requireRole(['SUPER_ADMIN']) as any,
  controller.verifyCompany,
);

export default router;
