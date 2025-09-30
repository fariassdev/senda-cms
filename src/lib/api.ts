import createFetchClient, { type Middleware } from 'openapi-fetch';
import createClient from 'openapi-react-query';

import { useAuthStore } from '@/stores/authStore';
import type { paths } from '@/types/api';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Create public client first (for auth operations that shouldn't use auth middleware)
const publicFetchClient = createFetchClient<paths>({
  baseUrl: API_BASE_URL,
});

/**
 * Check if a JWT token is expired or will expire soon
 */
function isTokenExpired(token: string, bufferMinutes = 5): boolean {
  try {
    const tokenPart = token.split('.')[1];
    if (!tokenPart) {
      return true; // Invalid token format, consider expired
    }
    const payload = JSON.parse(atob(tokenPart));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    const bufferTime = bufferMinutes * 60 * 1000; // Buffer in milliseconds
    return Date.now() >= expirationTime - bufferTime;
  } catch {
    // If we can't parse the token, consider it expired
    return true;
  }
}

// Create a separate public client for auth operations to avoid middleware loops

/**
 * Refresh the access token using the refresh token
 */
async function refreshAccessToken(): Promise<boolean> {
  const store = useAuthStore.getState();
  const refreshToken = store.refreshToken;

  if (!refreshToken) {
    return false;
  }

  try {
    const { data, error } = await publicFetchClient.POST('/api/auth/refresh', {
      body: {
        refresh_token: refreshToken,
      },
    });

    if (error || !data) {
      throw new Error('Refresh failed');
    }

    // Calculate expiration time
    const expiresAt = data.expires_in
      ? Date.now() + data.expires_in * 1000
      : undefined;

    // Update tokens in store
    store.updateTokens(
      data.access_token,
      data.refresh_token || refreshToken, // Use new refresh token if provided, otherwise keep current
      expiresAt,
    );

    return true;
  } catch (error) {
    console.error('Token refresh failed:', error);

    // Clear auth state on refresh failure
    store.clearAuth();
    return false;
  }
}

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const store = useAuthStore.getState();
    let token = store.token;

    // Check if token needs refresh before making the request
    if (token && isTokenExpired(token)) {
      console.log('Token expired, attempting refresh...');
      const refreshSuccess = await refreshAccessToken();

      if (refreshSuccess) {
        // Get the new token after refresh
        token = useAuthStore.getState().token;
      } else {
        // Refresh failed, don't send expired token
        token = null;
      }
    }

    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }

    return request;
  },

  async onResponse({ response }) {
    // Handle 401 responses by attempting token refresh
    if (response.status === 401) {
      console.log('Received 401, attempting token refresh...');
      const refreshSuccess = await refreshAccessToken();

      if (!refreshSuccess) {
        // Refresh failed, redirect to login or handle as needed
        console.log('Token refresh failed, user needs to re-authenticate');

        // Note: In a React component, you might want to trigger a redirect here
        // For now, we'll just log and let the component handle the auth state change
      }
    }

    return response;
  },
};

const fetchClient = createFetchClient<paths>({
  baseUrl: API_BASE_URL,
});

fetchClient.use(authMiddleware);

export const $api = createClient(fetchClient);

export const $publicApi = createClient(publicFetchClient);
