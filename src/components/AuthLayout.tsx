'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthRefresh } from '@/hooks/useAuthRefresh';
import { useAuthStore } from '@/stores/authStore';

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * AuthLayout component that handles client-side authentication state
 * - Initializes auth state from localStorage
 * - Manages loading states during auth check
 * - Handles automatic token refresh
 * - Auto-logout on token expiration
 * - Provides auth context to child components
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const { isLoading, isAuthenticated, initializeAuth } = useAuthStore();

  // Initialize authentication state on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Set up automatic token refresh
  useAuthRefresh();

  // Handle authentication state changes
  useEffect(() => {
    // Only redirect if we're done loading and not authenticated
    if (!isLoading && !isAuthenticated) {
      // Check if we're already on the login page to avoid infinite redirects
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.startsWith('/login')
      ) {
        router.push('/login');
      }
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="text-sm text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render children (middleware should handle redirects)
  if (!isAuthenticated) {
    return null;
  }

  // Render children if authenticated
  return <>{children}</>;
}
