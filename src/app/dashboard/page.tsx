'use client';

import { useAuth } from '../../components/AuthProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Box, CircularProgress, Paper } from '@mui/material';
import Layout from "../../components/layout";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Layout>
       
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Building A
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Paper sx={{ p: 2, flex: 1, bgcolor: '#f5f5f5' }}>
            <Typography variant="subtitle1">Camera 1</Typography>
            <Typography variant="body2">Status: Online</Typography>
          </Paper>

          <Paper sx={{ p: 2, flex: 1, bgcolor: '#f5f5f5' }}>
            <Typography variant="subtitle1">Camera 2</Typography>
            <Typography variant="body2">Status: Offline</Typography>
          </Paper>
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Building B
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Paper sx={{ p: 2, flex: 1, bgcolor: '#f5f5f5' }}>
            <Typography variant="subtitle1">Camera 3</Typography>
            <Typography variant="body2">Status: Online</Typography>
          </Paper>

          <Paper sx={{ p: 2, flex: 1, bgcolor: '#f5f5f5' }}>
            <Typography variant="subtitle1">Camera 4</Typography>
            <Typography variant="body2">Status: Online</Typography>
          </Paper>
        </Box>
      </Paper>
    </Layout>
  );
}
