import express from 'express';
import { getFeed, likePost, addComment } from '../controllers/postController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getFeed);
router.post('/:id/like', authMiddleware, likePost);
router.post('/:id/comment', authMiddleware, addComment);

export default router;
