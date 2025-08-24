import { Router } from 'express';
import { register, login, verifyEmail, getProfile, followUser, getAll, getUserProfile, updateProfile, getFollowers, getFollowing } from '../controllers/auth/authController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.get('/all', getAll);
router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.get('/profile', authMiddleware, getProfile);
router.get('/users/:id', getUserProfile); // Không cần auth để xem profile công khai
router.put('/users/:id', authMiddleware, updateProfile); // Cần auth để cập nhật
router.post('/follow/:userId', authMiddleware, followUser);
router.get('/users/:id/followers', getFollowers);
router.get('/users/:id/following', getFollowing);

export default router;