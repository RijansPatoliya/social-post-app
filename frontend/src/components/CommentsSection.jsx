import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  List,
  ListItem,
  CircularProgress,
} from '@mui/material';
import { addComment } from '../api';

/**
 * CommentsSection Component
 * Displays all comments and allows adding new comments to a post
 */
const CommentsSection = ({ postId, comments, onCommentAdded }) => {
  // State: Comment text input
  const [text, setText] = useState('');

  // State: Loading while submitting
  const [loading, setLoading] = useState(false);

  // State: Error message
  const [error, setError] = useState('');

  /**
   * Handle comment submission
   * Validates, sends to API, clears form on success
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Don't submit empty comments
    if (!text.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Call API to add comment
      const data = await addComment(postId, text.trim());

      // Clear input field
      setText('');

      // Notify parent component with updated post
      if (onCommentAdded) {
        onCommentAdded(data.post);
      }
    } catch (err) {
      // Show error if comment fails
      setError('Could not post comment. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2, borderTop: '1px solid #f0f0f0', pt: 1.5 }}>
      {/* Display existing comments */}
      {comments.length > 0 && (
        <List
          disablePadding
          sx={{
            maxHeight: 240,
            overflowY: 'auto',
            mb: 1,
          }}
        >
          {/* Map through comments */}
          {comments.map((comment, index) => (
            <ListItem
              key={index}
              alignItems="flex-start"
              sx={{
                px: 0,
                py: 0.5,
                gap: 1,
              }}
            >
              {/* Commenter Avatar */}
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: '#1976d2',
                  fontSize: 12,
                  flexShrink: 0,
                }}
              >
                {comment.username.charAt(0).toUpperCase()}
              </Avatar>

              {/* Comment Bubble */}
              <Box
                sx={{
                  bgcolor: '#f0f2f5',
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.75,
                  flex: 1,
                }}
              >
                {/* Commenter Name */}
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    display: 'block',
                  }}
                >
                  {comment.username}
                </Typography>

                {/* Comment Text */}
                <Typography variant="body2">{comment.text}</Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      )}

      {/* Error Message */}
      {error && (
        <Typography
          variant="caption"
          color="error"
          sx={{
            display: 'block',
            mb: 1,
          }}
        >
          {error}
        </Typography>
      )}

      {/* Comment Input Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          gap: 1,
          mt: 1,
        }}
      >
        {/* Text Input */}
        <TextField
          fullWidth
          size="small"
          placeholder="Add a comment…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 5,
            },
          }}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !text.trim()}
          sx={{
            borderRadius: 5,
            textTransform: 'none',
            px: 2.5,
            whiteSpace: 'nowrap',
          }}
        >
          {loading ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            'Post'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default CommentsSection;