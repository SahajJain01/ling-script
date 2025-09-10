import './globals.css';
import type { ReactNode } from 'react';
import TopNav from '@/components/TopNav';
import ToastProvider from '@/components/ToastProvider';

export const metadata = {
  title: 'Ling Script',
  description: 'Minimal mobile-first language practice',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>
        <ToastProvider>
          <TopNav />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
