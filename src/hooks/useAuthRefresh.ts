/**
 * Hook for handling authentication state changes and logout redirect
 */

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthStore } from '@/stores/authStore';

export function useAuthRefresh() {
  const router = useRouter();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = useAuthStore.subscribe((state, previousState) => {
      // If user was authenticated but now isn't (logout or 401 response)
      if (previousState.isAuthenticated && !state.isAuthenticated) {
        console.log('Authentication lost, redirecting to login...');
        router.push('/login');
      }
    });

    return unsubscribe;
  }, [router]);
}
