import { Router } from 'express';
import { InstitutionController } from './institution.controller';
import { authenticate, requireRole } from '../../shared/middleware/authMiddleware';

const router = Router();
const controller = new InstitutionController();

// Protected Institution Management
router.get('/my', authenticate as any, controller.getMyInstitution);
router.get('/faculty', authenticate as any, controller.getFaculty);
router.get('/students', authenticate as any, requireRole(['INSTITUTION_SPOC', 'SUPER_ADMIN']) as any, controller.getStudents);
router.patch('/students/:id/verify', authenticate as any, requireRole(['INSTITUTION_SPOC', 'SUPER_ADMIN']) as any, controller.verifyStudent);

// Public Institution Directory
router.get('/', controller.getInstitutions);
router.get('/:id', controller.getInstitutionById);

// Protected Institution Management Actions
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
