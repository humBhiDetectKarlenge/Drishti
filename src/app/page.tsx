'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthProvider';
import { Button, Typography, Container, Stack, CircularProgress, Box } from '@mui/material';
import { loginWithGoogle } from '../lib/auth';
import Script from "next/script";


export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  if (loading || user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.MAPS_API_KEY}`}
        strategy="beforeInteractive"
      />
      <Typography variant="h4" gutterBottom>
        Welcome to Drishti
      </Typography>
      <Stack spacing={2}>
        <Button variant="contained" color="primary" onClick={handleGoogleLogin}>
          Sign in with Google
        </Button>
      </Stack>
    </Container>
  );
}
