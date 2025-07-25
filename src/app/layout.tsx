import './global.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import Providers from './Providers';
import GoogleTranslate from '../components/GoogleTranslate';
import MapProvider from '@/components/MapProvider';
export const metadata = {
  title: 'Drishti Dashboard',
  description: 'A Firebase Auth Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
        <MapProvider>
          <Providers>
            {children}
          </Providers>
          </MapProvider>
        </AppRouterCacheProvider>
        <GoogleTranslate /> 
      </body>
    </html>
  );
}
