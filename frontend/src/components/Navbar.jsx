import React from 'react';
import { AppBar, Toolbar, Typography, Box, Avatar, IconButton, Tooltip, Container } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Returns 'primary' color for active route, 'default' otherwise
  const color = (path) => (location.pathname === path ? 'primary' : 'default');

  return (
    <AppBar position="sticky" elevation={0}
      sx={{ bgcolor: '#fff', borderBottom: '1px solid #e0e0e0', color: '#333' }}>
      <Container maxWidth="md">
        <Toolbar sx={{ justifyContent: 'space-between', px: '0 !important', height: 60 }}>

          {/* Brand */}
          <Typography variant="h6" onClick={() => navigate('/')}
            sx={{ fontWeight: 800, color: '#1976d2', cursor: 'pointer', letterSpacing: -0.5 }}>
            SOCIAL
          </Typography>

          {/* Navigation icons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Home">
              <IconButton color={color('/')} onClick={() => navigate('/')}>
                <HomeIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Create Post">
              <IconButton color={color('/create')} onClick={() => navigate('/create')}>
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="My Profile">
              <IconButton color={color('/profile')} onClick={() => navigate('/profile')}>
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* User avatar + logout */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar onClick={() => navigate('/profile')}
              sx={{ width: 34, height: 34, bgcolor: '#1976d2', cursor: 'pointer', fontSize: 15 }}>
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Tooltip title="Logout">
              <IconButton color="error" size="small" onClick={logout}>
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
