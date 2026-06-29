import { Router } from 'express';
import { InstitutionController } from './institution.controller';
import { authenticate, requireRole } from '../../shared/middleware/authMiddleware';

const router = Router();
const controller = new InstitutionController();

// Public Institution Directory
router.get('/', controller.getInstitutions);
router.get('/:id', controller.getInstitutionById);

// Protected Institution Management
router.post(
  '/',
  authenticate as any,
  requireRole(['SUPER_ADMIN']) as any,
  controller.createInstitution,
);
router.patch(
  '/:id',
  authenticate as any,
  requireRole(['SUPER_ADMIN', 'INSTITUTION_SPOC']) as any,
  controller.updateInstitution,
);
router.post(
  '/:id/verify',
  authenticate as any,
  requireRole(['SUPER_ADMIN']) as any,
  controller.verifyInstitution,
);

export default router;
