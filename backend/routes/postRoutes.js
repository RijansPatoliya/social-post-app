import express from 'express';
import { createPost, getFeed, likePost, addComment } from '../controllers/postController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getFeed);
router.post('/', authMiddleware, upload.single('image'), createPost);
router.post('/:id/like', authMiddleware, likePost);
router.post('/:id/comment', authMiddleware, addComment);

export default router;
