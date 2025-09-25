/**
 * Authenticated API client that integrates with the auth store
 */

import { useAuthStore } from '@/stores/authStore';
import { ApiClient } from './api';

/**
 * Create an API client that automatically uses the token from the auth store
 * and handles authentication errors by clearing the auth state
 */
export function createAuthenticatedApiClient() {
  return new ApiClient({
    getToken: () => {
      const { token } = useAuthStore.getState();
      return token;
    },
  });
}

/**
 * Pre-configured authenticated API client
 */
export const authenticatedApiClient = createAuthenticatedApiClient();

/**
 * Higher-order function to handle API errors with automatic logout
 */
export async function withAuthErrorHandling<T>(
  apiCall: () => Promise<T>,
): Promise<T> {
  try {
    return await apiCall();
  } catch (error: unknown) {
    // Check if it's an authentication/authorization error
    if (error instanceof Error && 'status' in error) {
      const apiError = error as { status: number };
      if (apiError.status === 401 || apiError.status === 403) {
        // Clear auth state to trigger logout
        useAuthStore.getState().clearAuth();
      }
    }
    // Re-throw the error for the calling code to handle
    throw error;
  }
}
