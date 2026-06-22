import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert, CircularProgress, Link } from '@mui/material';
import { signupUser } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const isValidGmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(email.trim());

const Signup = ({ onSwitchToLogin }) => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const email = form.email.trim();
    if (!form.username || !email || !form.password) {
      return setError('All fields are required');
    }
    if (!isValidGmail(email)) {
      showToast('Invalid email address.', 'error');
      return setError('Invalid email address');
    }

    setLoading(true);
    try {
      const data = await signupUser(form.username, email, form.password);
      login(data.user, data.token); // Immediately log in after signup
      showToast('Signed up successfully! Welcome aboard.', 'success');
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f0f2f5' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, textAlign: 'center', color: '#1976d2' }}>
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
          Join the community today
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField fullWidth name="username" label="Username" value={form.username}
            onChange={handleChange} margin="normal" disabled={loading} />
          <TextField fullWidth name="email" label="Email" type="email" value={form.email}
            onChange={handleChange} margin="normal" disabled={loading} />
          <TextField fullWidth name="password" label="Password" type="password" value={form.password}
            onChange={handleChange} margin="normal" disabled={loading} sx={{ mb: 2 }} />

          <Button fullWidth type="submit" variant="contained" disabled={loading}
            sx={{ py: 1.2, fontWeight: 600, borderRadius: 2 }}>
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign Up'}
          </Button>
        </form>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 2, color: '#555' }}>
          Already have an account?{' '}
          <Link onClick={onSwitchToLogin} sx={{ cursor: 'pointer', fontWeight: 600 }}>Log in</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Signup;