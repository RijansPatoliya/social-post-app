import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { createPost } from '../api';

/**
 * CreatePost Component
 * Form to create new post with text and/or image
 * Calls onPostCreated() callback when post is successfully created
 */
const CreatePost = ({ onPostCreated }) => {
  // State: Post text content
  const [text, setText] = useState('');

  // State: Image file object (for uploading)
  const [image, setImage] = useState(null);

  // State: Preview URL (to show image before upload)
  const [preview, setPreview] = useState('');

  // State: Loading while submitting
  const [loading, setLoading] = useState(false);

  // State: Error message
  const [error, setError] = useState('');

  /**
   * Handle image selection
   * Creates preview URL so user can see image before posting
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // Check if file exists
    if (!file) return;

    // Store file for upload
    setImage(file);

    // Create preview URL (display in browser)
    setPreview(URL.createObjectURL(file));
  };

  /**
   * Handle form submission
   * Validates inputs, uploads to server, clears form on success
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate: at least text or image required
    if (!text.trim() && !image) {
      return setError('Add some text or an image');
    }

    setError('');
    setLoading(true);

    try {
      // Send to API
      const data = await createPost(text, image);

      // Success: Clear all form fields
      setText('');
      setImage(null);
      setPreview('');

      // Notify parent component (Feed) with new post
      if (onPostCreated) {
        onPostCreated(data.post);
      }
    } catch (err) {
      // Show error message if upload fails
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid #e0e0e0',
      }}
    >
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading Progress Bar */}
      {loading && (
        <LinearProgress
          sx={{
            mb: 2,
            borderRadius: 1,
          }}
        />
      )}

      {/* Post Form */}
      <form onSubmit={handleSubmit}>
        {/* Text Input Area */}
        <TextField
          fullWidth
          multiline
          minRows={3}
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />

        {/* Image Preview (if user selected image) */}
        {preview && (
          <Box
            sx={{
              mb: 2,
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid #eee',
            }}
          >
            <img
              src={preview}
              alt="Preview"
              style={{
                width: '100%',
                maxHeight: 300,
                objectFit: 'contain',
                display: 'block',
                background: '#000',
              }}
            />
          </Box>
        )}

        {/* Action Buttons Row */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Image Upload Button */}
          <Button
            component="label"
            startIcon={<ImageIcon />}
            disabled={loading}
            sx={{
              textTransform: 'none',
              color: '#1976d2',
            }}
          >
            {/* Show filename if image selected, else "Add Photo" */}
            {image ? image.name : 'Add Photo'}

            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>

          {/* Submit Post Button */}
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
            }}
          >
            Post
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CreatePost;