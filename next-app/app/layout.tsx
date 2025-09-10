import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Ling Script',
  description: 'Minimal mobile-first language practice',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
