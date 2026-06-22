import express from 'express';
import { createPost, getFeed, likePost, addComment, getUserPosts, deletePost } from '../controllers/postController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { uploadImage } from '../middleware/upload.js';

const router = express.Router();

// Get all posts for the main feed
router.get('/', authMiddleware, getFeed);

// Get posts by a specific user (used in Profile page)
router.get('/user/:userId', authMiddleware, getUserPosts);

// Create a new post (supports image upload)
router.post('/', authMiddleware, uploadImage, createPost);

// Like or unlike a post
router.post('/:id/like', authMiddleware, likePost);

// Add a comment to a post
router.post('/:id/comment', authMiddleware, addComment);

// Delete a post (owner only)
router.delete('/:id', authMiddleware, deletePost);

export default router;
