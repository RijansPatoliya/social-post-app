import React, { useState } from 'react';
import {
  Card, CardContent, CardMedia, Box, Avatar, Typography,
  IconButton, Button,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import DeleteIcon from '@mui/icons-material/Delete';
import { toggleLikePost, deletePost } from '../api';
import CommentsSection from './CommentsSection';
import { useAuth } from '../context/AuthContext';

/**
 * PostCard — Single post in the feed or profile.
 *
 * Props:
 *   post          — post object from the backend
 *   onPostUpdated — called with the updated post when liked/commented
 *   onPostDeleted — called with the post _id when deleted
 *   isProfileView — when true, shows the Delete button on own posts
 */
const PostCard = ({ post, onPostUpdated, onPostDeleted, isProfileView = false }) => {
  const { user } = useAuth();

  // The backend always returns string _id thanks to our toPlain() helper
  const postId = post._id;

  // Current user ID from localStorage (supports both old _id and new id)
  const myId = (user?.id || user?._id)?.toString() || '';

  const [isLiked, setIsLiked] = useState(
    () => post.likes?.some((l) => l.userId === myId) || false
  );
  const [showComments, setShowComments] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Format timestamps nicely
  const formatTime = (iso) => {
    if (!iso) return '';
    const diff = (Date.now() - new Date(iso)) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(iso).toLocaleDateString();
  };

  // Toggle like
  const handleLike = async () => {
    try {
      const data = await toggleLikePost(postId);
      setIsLiked(data.liked);
      if (onPostUpdated) onPostUpdated(data.post);
    } catch (err) {
      console.error('Like failed:', err.message);
    }
  };

  // Delete post (profile view only)
  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    setDeleting(true);
    try {
      await deletePost(postId);
      if (onPostDeleted) onPostDeleted(postId);
    } catch (err) {
      alert(err.message || 'Delete failed');
      setDeleting(false);
    }
  };

  // Update the post state when a comment is added
  const handleCommentAdded = (updatedPost) => {
    if (onPostUpdated) onPostUpdated(updatedPost);
  };

  const isOwner = post.userId === myId;

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', mb: 3, overflow: 'hidden' }}>
      {/* ── Header ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: '#1976d2', fontWeight: 700 }}>
            {post.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {post.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatTime(post.createdAt)}
            </Typography>
          </Box>
        </Box>

        {/* Delete button — only on Profile page for own posts */}
        {isProfileView && isOwner && (
          <IconButton size="small" color="error" onClick={handleDelete} disabled={deleting}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* ── Post text ── */}
      {post.text && (
        <Typography variant="body1" sx={{ px: 2, pb: post.image ? 1.5 : 0, color: '#1a1a1a' }}>
          {post.text}
        </Typography>
      )}

      {/* ── Post image (full width, no cropping) ── */}
      {post.image && (
        <CardMedia component="img" image={post.image}
          sx={{ width: '100%', maxHeight: 600, objectFit: 'contain', bgcolor: '#000' }} />
      )}

      {/* ── Actions ── */}
      <CardContent sx={{ py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={handleLike} sx={{ color: isLiked ? '#e53935' : '#555' }}>
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <IconButton onClick={() => setShowComments((v) => !v)} sx={{ color: '#555' }}>
            <ChatBubbleIcon />
          </IconButton>
        </Box>

        {/* Counts */}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, px: 1 }}>
          {post.likes?.length || 0} {post.likes?.length === 1 ? 'like' : 'likes'}
        </Typography>
        {post.comments?.length > 0 && (
          <Typography variant="body2" color="text.secondary"
            sx={{ px: 1, cursor: 'pointer' }} onClick={() => setShowComments((v) => !v)}>
            View all {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
          </Typography>
        )}

        {/* Comments section */}
        {showComments && (
          <CommentsSection
            postId={postId}
            comments={post.comments || []}
            onCommentAdded={handleCommentAdded}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;