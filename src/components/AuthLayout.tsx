'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Navigation } from '@/components/Navigation';
import CourseList from '@/containers/Main/CourseList';
import useAuthRefresh from '@/hooks/useAuthRefresh';
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
  const pathname = usePathname();
  const { isLoading, isAuthenticated, initializeAuth } = useAuthStore();

  // Check if we're on the login page
  const isLoginPage = pathname.startsWith('/login');

  // Handle auth refresh and logout
  useAuthRefresh();

  // Initialize authentication state on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Handle authentication state changes
  useEffect(() => {
    // Only redirect if we're done loading and not authenticated, and not on login page
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, isLoginPage, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show course list with loading state when authenticated but still on login page (seamless transition)
  if (isAuthenticated && isLoginPage) {
    return (
      <Navigation>
        <CourseList />
      </Navigation>
    );
  }

  // Allow login page to render only when not authenticated
  if (!isAuthenticated && isLoginPage) {
    return <>{children}</>;
  }

  // If not authenticated and not on login page, don't render children (redirect should happen)
  if (!isAuthenticated) {
    return null;
  }

  // Render children with navigation if authenticated
  return <Navigation>{children}</Navigation>;
}
