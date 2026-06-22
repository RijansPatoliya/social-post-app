import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  CircularProgress,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { getAllPosts } from '../api';
import CreatePost from './CreatePost';
import PostCard from './PostCard';

/**
 * Feed Component
 * Displays all posts, allows creating posts, liking and commenting
 */
const Feed = () => {
  // State: All posts from database
  const [posts, setPosts] = useState([]);

  // State: Loading while fetching posts
  const [loading, setLoading] = useState(true);

  // State: Error message
  const [error, setError] = useState('');

  // State: Refreshing when user clicks refresh button
  const [refreshing, setRefreshing] = useState(false);

  // Load posts when component mounts
  useEffect(() => {
    loadPosts();
  }, []);

  /**
   * Fetch all posts from API and sort by newest first
   */
  const loadPosts = async () => {
    try {
      setError('');

      // Get all posts from backend
      const response = await getAllPosts();

      // Sort posts by date (newest first)
      const postsArray = Array.isArray(response)
        ? response
        : response.posts;

      const sortedPosts = postsArray.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setPosts(sortedPosts);
    } catch (err) {
      setError(err.message || 'Failed to load posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh feed - reload all posts
   */
  const handleRefresh = async () => {
    setRefreshing(true);

    // Small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    await loadPosts();
    setRefreshing(false);
  };

  /**
   * When user creates new post
   * Add it to top of feed
   */
  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  /**
   * When user likes/comments on post
   * Update that post in the feed
   */
  const handlePostUpdated = (updatedPost) => {
    setPosts(
      posts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  // Show loading spinner
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ marginTop: 2, color: '#666' }}>
            Loading posts...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', paddingY: 2 }}>
      <Container maxWidth="sm">
        {/* Header with title and refresh button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 3,
            paddingTop: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: '#333',
            }}
          >
            Social Feed
          </Typography>

          {/* Refresh Button */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{
              textTransform: 'none',
            }}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </Box>

        {/* Create Post Form */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
            <Button
              size="small"
              onClick={handleRefresh}
              sx={{ marginLeft: 1 }}
            >
              Try Again
            </Button>
          </Alert>
        )}

        {/* Display Posts */}
        {posts.length > 0 ? (
          <Box>
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onPostUpdated={handlePostUpdated}
              />
            ))}
          </Box>
        ) : (
          /* Empty State - No Posts */
          <Box
            sx={{
              textAlign: 'center',
              paddingY: 4,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#999',
                marginBottom: 1,
              }}
            >
              No posts yet
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: '#ccc',
              }}
            >
              Be the first to share something!
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Feed;