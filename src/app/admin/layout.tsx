import React from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
