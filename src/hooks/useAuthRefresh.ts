/**
 * Hook for handling authentication refresh and logout logic
 */

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthStore } from '@/stores/authStore';

export function useAuthRefresh() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = useAuthStore.subscribe((state, previousState) => {
      // If user was authenticated but now isn't (logout or token refresh failed)
      if (previousState.isAuthenticated && !state.isAuthenticated) {
        console.log('Authentication lost, redirecting to login...');
        router.push('/login');
      }
    });

    return unsubscribe;
  }, [router]);

  // Monitor token expiration
  useEffect(() => {
    if (!token || !isAuthenticated) {
      return;
    }

    // Check token expiration every minute
    const interval = setInterval(() => {
      try {
        const tokenPart = token.split('.')[1];
        if (!tokenPart) {
          console.warn('Invalid JWT token format');
          return;
        }
        const payload = JSON.parse(atob(tokenPart));
        const expirationTime = payload.exp * 1000;

        // If token expires in the next 5 minutes, it will be refreshed by the middleware
        // If it's already expired and we're still here, something went wrong
        if (Date.now() >= expirationTime) {
          console.log(
            'Token is expired and was not refreshed, clearing auth...',
          );
          useAuthStore.getState().clearAuth();
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
        useAuthStore.getState().clearAuth();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [token, isAuthenticated]);
}
