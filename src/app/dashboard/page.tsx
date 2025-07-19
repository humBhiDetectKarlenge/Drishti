'use client';

import dynamic from 'next/dynamic';
import { useAuth } from '../../components/AuthProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Box, CircularProgress, Paper } from '@mui/material';

const HeatmapMap = dynamic(() => import('@/components/HeatmapMap'), {
  ssr: false,
});

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
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h5" gutterBottom>People Stats</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
  {[
    { label: 'Total Attendees', value: '676,8979', color: '#e3f2fd' },        
    { label: 'Total Commanders', value: '23', color: '#fce4ec' },               
    { label: 'Emergency Responders', value: '300', color: '#e8f5e9' },       
    { label: 'Field Guards', value: '2300', color: '#fff3e0' },               
  ].map((item) => (
    <Paper
      key={item.label}
      sx={{
        p: 2,
        textAlign: 'center',
        backgroundColor: item.color,
        boxShadow: 2,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5">{item.value}</Typography>
      <Typography variant="body2">{item.label}</Typography>
    </Paper>
  ))}
</Box>

      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Zone Status</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {[
            { label: 'West Gate', value: '4200 / 5000', density: '80%', color: 'red' },
            { label: 'VIP Area', value: '4200 / 5000', density: '80%', color: 'red' },
            { label: 'Main Stage', value: '4200 / 5000', density: '80%', color: 'red' },
            { label: 'Exit Gate', value: '4200 / 5000', density: '60%', color: 'yellow' },
            { label: 'Dinner Place', value: '4200 / 5000', density: '80%', color: 'red' },
            { label: 'Parking', value: '420 / 5000', density: '20%', color: 'green' },
          ].map((zone) => (
            <Paper key={zone.label} sx={{ p: 2, flex: '1 1 30%', bgcolor: '#f5f5f5' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1">{zone.label}</Typography>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor:
                      zone.color === 'red'
                        ? 'error.main'
                        : zone.color === 'yellow'
                        ? 'warning.main'
                        : 'success.main',
                  }}
                />
              </Box>
              <Typography variant="body2">
                {zone.value} • {zone.density} Density
              </Typography>
            </Paper>
          ))}
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <HeatmapMap />
      </Paper>
    </Box>
  );
}
