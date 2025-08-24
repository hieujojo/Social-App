import { Router } from 'express';
import { getNotifications, markAsRead } from '../controllers/posts/notificationController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, getNotifications);
router.put('/:notificationId/read', authMiddleware, markAsRead);

export default router;