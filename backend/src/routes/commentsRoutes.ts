import { Router } from 'express';
import { addComment, getComments } from '../controllers/posts/commentController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, addComment);
router.get('/post/:postId', authMiddleware, getComments);

export default router;