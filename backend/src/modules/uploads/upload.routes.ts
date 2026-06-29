import { Router } from 'express';
import multer from 'multer';
import { UploadController } from './upload.controller';
import { authenticate } from '../../shared/middleware/authMiddleware';

const router = Router();
const controller = new UploadController();

// Configure Multer in-memory storage with size limits
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // Max dataset file size (100MB)
  },
});

// Protected Upload endpoints
router.post('/', authenticate as any, upload.single('file'), controller.uploadFile);
router.get('/jobs', authenticate as any, controller.getJobs);
router.get('/health/storage', authenticate as any, controller.getStorageHealth);
router.get('/:id', authenticate as any, controller.getFileDetails);

export default router;
