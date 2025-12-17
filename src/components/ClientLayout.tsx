'use client';

import { AudioPlayer } from '@/components/AudioPlayer';
import AuthLayout from '@/components/AuthLayout';
import QueryProvider from '@/components/QueryProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { AudioPlayerProvider } from '@/contexts/AudioPlayerContext';

interface ClientLayoutProps {
  children: React.ReactNode;
}

/**
 * Client-side layout wrapper that handles authentication and data fetching
 * This separates the client-side logic from the server-side root layout
 * Provider hierarchy: ThemeProvider → QueryProvider → AudioPlayerProvider → AuthLayout → children + Toaster + AudioPlayer
 */
export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AudioPlayerProvider>
          <AuthLayout>{children}</AuthLayout>
          <Toaster />
          <AudioPlayer />
        </AudioPlayerProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
