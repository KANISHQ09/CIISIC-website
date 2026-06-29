import { Router } from 'express';
import { MessageController } from './message.controller';
import { authenticate } from '../../shared/middleware/authMiddleware';

const router = Router();
const controller = new MessageController();

// Protected Message routes
router.post('/conversations', authenticate as any, controller.getOrCreateConversation);
router.get('/', authenticate as any, controller.getMessages);
router.post('/', authenticate as any, controller.sendMessage);

export default router;
