import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, Box, CssBaseline, CircularProgress } from '@mui/material';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import FeedPage from './pages/FeedPage';
import CreatePage from './pages/CreatePage';
import ProfilePage from './pages/ProfilePage';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    background: { default: '#f0f2f5' },
  },
  typography: { fontFamily: '"Segoe UI", Roboto, Arial, sans-serif' },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
  },
});

const App = () => {
  const { isAuthenticated, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  // Wait for localStorage to be read before deciding which screen to show
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Not logged in — show auth screens
  if (!isAuthenticated()) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {showLogin
          ? <Login onSwitchToSignup={() => setShowLogin(false)} />
          : <Signup onSwitchToLogin={() => setShowLogin(true)} />}
      </ThemeProvider>
    );
  }

  // Logged in — show app with navbar and routes
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
};

export default App;