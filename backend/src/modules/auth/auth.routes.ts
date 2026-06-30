import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticate } from '../../shared/middleware/authMiddleware';
import { authRateLimiter } from '../../shared/middleware/rateLimiter';

const router = Router();
const controller = new AuthController();

router.post('/register', authRateLimiter, controller.register);
router.post('/login', authRateLimiter, controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);
router.post('/forgot-password', authRateLimiter, controller.forgotPassword);
router.post('/reset-password', authRateLimiter, controller.resetPassword);
router.post('/verify-email', authRateLimiter, controller.verifyEmail);

// Protected routes
router.post('/logout-all', authenticate as any, controller.logoutAll);
router.get('/me', authenticate as any, controller.me);

export default router;
