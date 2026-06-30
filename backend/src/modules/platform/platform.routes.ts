import { Router } from 'express';
import { PlatformController } from './platform.controller';
import { authenticate, requireRole } from '../../shared/middleware/authMiddleware';

const router = Router();
const controller = new PlatformController();

// CMS Endpoints
router.get('/cms/:slug', controller.getPage);
router.post(
  '/cms/:slug',
  authenticate as any,
  requireRole(['SUPER_ADMIN']) as any,
  controller.updatePage,
);

// Settings Endpoints
router.get('/settings/:key', authenticate as any, controller.getSetting);
router.post(
  '/settings/:key',
  authenticate as any,
  requireRole(['SUPER_ADMIN']) as any,
  controller.updateSetting,
);

// Announcements Endpoints
router.get('/announcements', authenticate as any, controller.getAnnouncements);
router.post(
  '/announcements',
  authenticate as any,
  requireRole(['SUPER_ADMIN']) as any,
  controller.createAnnouncement,
);

// Resources Endpoints
router.get('/resources', authenticate as any, controller.getResources);
router.post(
  '/resources',
  authenticate as any,
  requireRole(['SUPER_ADMIN']) as any,
  controller.createResource,
);

// Platform Operations & Health check
router.get('/health', controller.getPlatformHealth);
router.get('/readiness', controller.getReadiness);
router.get('/liveness', controller.getLiveness);

// Permissions Endpoints
router.get('/permissions', authenticate as any, requireRole(['SUPER_ADMIN']) as any, controller.getPermissions);
router.patch('/permissions/:key', authenticate as any, requireRole(['SUPER_ADMIN']) as any, controller.updatePermission);

// Contact Form Endpoint
router.post('/contact', controller.submitContactForm);

export default router;
