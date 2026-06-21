// ============================================
// Main App Component
// ============================================
// Root component that handles routing between authentication and feed
// Also sets up Material UI theme and global styles

import React, { useState } from 'react';
import { ThemeProvider, createTheme, Box, CircularProgress } from '@mui/material';
import { useAuth } from './context/AuthContext';
import Signup from './components/Signup';
import Login from './components/Login';
import Feed from './components/Feed';

/**
 * Create Material UI Theme
 * Customizes colors, typography, and component styles
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue - matches TaskPlanet branding
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    // Customize Button styling
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: '8px',
        },
      },
    },
    // Customize TextField styling
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
    // Customize Card styling
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
  },
});

/**
 * App Component
 * Main application component that handles:
 * - Authentication state (logged in or not)
 * - Switching between auth screens and feed
 * - Theme provider setup
 */
const App = () => {
  // Get authentication state and loading status
  const { isAuthenticated, loading } = useAuth();

  // State to track which auth screen to show (signup or login)
  const [showLogin, setShowLogin] = useState(false);

  // Show loading spinner while checking auth status
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
        <CircularProgress />
      </Box>
    );
  }

  // If user is authenticated, show the feed
  if (isAuthenticated()) {
    return (
      <ThemeProvider theme={theme}>
        <Feed />
      </ThemeProvider>
    );
  }

  // If not authenticated, show auth screens
  return (
    <ThemeProvider theme={theme}>
      {showLogin ? (
        // Show login screen
        <Login onSwitchToSignup={() => setShowLogin(false)} />
      ) : (
        // Show signup screen
        <Signup onSwitchToLogin={() => setShowLogin(true)} />
      )}
    </ThemeProvider>
  );
};

export default App;