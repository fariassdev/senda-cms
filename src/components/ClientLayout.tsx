'use client';

import AuthLayout from '@/components/AuthLayout';

interface ClientLayoutProps {
  children: React.ReactNode;
}

/**
 * Client-side layout wrapper that handles authentication
 * This separates the client-side auth logic from the server-side root layout
 */
export default function ClientLayout({ children }: ClientLayoutProps) {
  return <AuthLayout>{children}</AuthLayout>;
}
