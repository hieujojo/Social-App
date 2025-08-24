import { Router } from 'express';
import { createPost, likePost, getAllPosts, getPostsByUser } from '../controllers/posts/postController';
import authMiddleware from '../middleware/authMiddleware';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'public/images/' });

router.post('/', authMiddleware, createPost);
router.get('/all', getAllPosts);
router.get('/user/:userId', getPostsByUser);
router.post('/like/:postId', authMiddleware, likePost);
router.post('/upload-image', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ imageUrl: `/images/${req.file.filename}` });
});

export default router;
