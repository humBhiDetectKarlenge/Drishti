'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthProvider';
import { Button, TextField, Typography, Container, Stack, CircularProgress, Box } from '@mui/material';
import { loginWithGoogle, loginWithEmail } from '../lib/auth';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  const handleEmailLogin = async () => {
    try {
      await loginWithEmail(email, password);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  // Show spinner while loading auth state
  if (loading || user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Drishti
      </Typography>
      <Stack spacing={2}>
        <Button variant="contained" color="primary" onClick={handleGoogleLogin}>
          Sign in with Google
        </Button>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="outlined" color="secondary" onClick={handleEmailLogin}>
          Login with Email
        </Button>
      </Stack>
    </Container>
  );
}
