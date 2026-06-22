import React from 'react';
import { Container, Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import CreatePost from '../components/CreatePost';

const CreatePage = () => {
  const navigate = useNavigate();

  // After a post is successfully created, go back to the feed
  const handleCreated = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          New Post
        </Typography>
      </Box>

      <CreatePost onPostCreated={handleCreated} />
    </Container>
  );
};

export default CreatePage;
