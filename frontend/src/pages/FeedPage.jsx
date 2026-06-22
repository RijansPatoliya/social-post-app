import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress, Alert, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { getAllPosts } from '../api';
import PostCard from '../components/PostCard';

const FeedPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data.posts || []);
      } catch (err) {
        setError('Could not load the feed.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Replace the post in state when it's liked or commented on
  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  // Remove the post from state when deleted
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
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center', color: '#1976d2' }}>
        Social Feed
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {posts.length === 0 ? (
        <Typography sx={{ textAlign: 'center', color: '#888', mt: 6 }}>
          No posts yet. Be the first to share!
        </Typography>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onPostUpdated={handlePostUpdated}
            onPostDeleted={handlePostDeleted}
            isProfileView={false}
          />
        ))
      )}

      {/* Floating button — quickly navigate to Create page */}
      <Fab color="primary" onClick={() => navigate('/create')}
        sx={{ position: 'fixed', bottom: 32, right: 32 }}>
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default FeedPage;
