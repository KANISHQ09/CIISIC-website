import { Router } from 'express';
import { CellController } from './cell.controller';
import { authenticate, requireRole } from '../../shared/middleware/authMiddleware';

const router = Router();
const controller = new CellController();

// Public Cells Directory
router.get('/', controller.getCells);
router.get('/:id', controller.getCellById);

// Protected Cells Management
router.post('/', authenticate as any, requireRole(['SUPER_ADMIN']) as any, controller.createCell);
router.patch(
  '/:id',
  authenticate as any,
  requireRole(['SUPER_ADMIN']) as any,
  controller.updateCell,
);
router.delete(
  '/:id',
  authenticate as any,
  requireRole(['SUPER_ADMIN']) as any,
  controller.deleteCell,
);

export default router;
