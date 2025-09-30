'use client';

import AuthLayout from '@/components/AuthLayout';
import QueryProvider from '@/components/QueryProvider';

interface ClientLayoutProps {
  children: React.ReactNode;
}

/**
 * Client-side layout wrapper that handles authentication and data fetching
 * This separates the client-side logic from the server-side root layout
 * Provider hierarchy: QueryProvider → AuthLayout → children
 */
export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <QueryProvider>
      <AuthLayout>{children}</AuthLayout>
    </QueryProvider>
  );
}
