import { Router } from 'express';
import { register, login, refreshToken, getMe } from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/me', requireAuth, getMe);

export default router;
