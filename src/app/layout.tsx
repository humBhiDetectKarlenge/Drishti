import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import Providers from './Providers';
import Layout from '../components/layout'; 

export const metadata = {
  title: 'Drishti Dashboard',
  description: 'A Firebase Auth Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <Providers>
            <Layout>{children}</Layout>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
