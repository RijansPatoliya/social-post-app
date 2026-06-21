// Handles user login with email and password authentication

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Link,
} from '@mui/material';
import { loginUser } from '../api';
import { useAuth } from '../context/AuthContext';

const Login = ({ onSwitchToSignup }) => {
  // Form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auth context to update global user state after login
  const { login } = useAuth();

  /**
   * Handle form submission
   * Validates inputs, calls login API, and updates global auth state if successful
   */
  const handleLogin = async (e) => {
    e.preventDefault();

    // Reset previous error messages
    setError('');

    // Validation: Check if both fields are filled
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    // Start loading
    setLoading(true);

    try {
      // Call login API with credentials
      const response = await loginUser(email, password);

      // API should return user data and token
      if (response.token && response.user) {
        // Log user in using auth context
        login(response.user, response.token);

        // Redirect will be handled by parent component detecting logged-in state
      }
    } catch (err) {
      // Show error message from API
      setError(err.message || 'Invalid email or password');
    } finally {
      // Stop loading
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 2,
        }}
      >
        {/* Header */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            marginBottom: 1,
            textAlign: 'center',
            color: '#1976d2',
          }}
        >
          Welcome Back
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#666',
            marginBottom: 3,
            textAlign: 'center',
          }}
        >
          Login to your account
        </Typography>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={loading}
          />

          {/* Password Field */}
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={loading}
            sx={{ marginBottom: 2 }}
          />

          {/* Login Button */}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            sx={{
              padding: '10px',
              fontWeight: 600,
              fontSize: '16px',
              marginBottom: 2,
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ marginRight: 1 }} />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>

        {/* Switch to Signup Link */}
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            color: '#666',
          }}
        >
          Don't have an account?{' '}
          <Link
            onClick={onSwitchToSignup}
            sx={{
              color: '#1976d2',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Sign up here
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
