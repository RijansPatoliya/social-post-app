import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Avatar, Paper, Divider,
  CircularProgress, Alert,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { getUserPosts } from '../api';
import PostCard from '../components/PostCard';

const ProfilePage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    // Support both older session structures (_id) and new ones (id)
    const userId = user.id || user._id;

    const load = async () => {
      try {
        const data = await getUserPosts(userId);
        setPosts(data.posts || []);
      } catch (err) {
        setError('Could not load your posts.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* ── Profile Header ── */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ width: 72, height: 72, bgcolor: '#1976d2', fontSize: 28, fontWeight: 700 }}>
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{user?.username}</Typography>
            <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 1.5 }} />
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{posts.length}</Typography>
            <Typography variant="caption" color="text.secondary">POSTS</Typography>
          </Box>
        </Box>
      </Paper>

      {/* ── My Posts ── */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>My Posts</Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {posts.length === 0 ? (
        <Paper elevation={0} sx={{ p: 5, textAlign: 'center', borderRadius: 3, border: '1px dashed #ccc' }}>
          <Typography color="text.secondary">You haven't posted anything yet.</Typography>
        </Paper>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onPostUpdated={handlePostUpdated}
            onPostDeleted={handlePostDeleted}
            isProfileView={true}
          />
        ))
      )}
    </Container>
  );
};

export default ProfilePage;
