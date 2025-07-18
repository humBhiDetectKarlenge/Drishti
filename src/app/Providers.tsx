'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../theme/theme'; 
import { ReactNode } from 'react';
import AuthProvider from '../components/AuthProvider';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
