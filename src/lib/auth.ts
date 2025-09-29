/**
 * Authentication API functions for Senda CMS
 * Handles login, token validation, and user data management
 */

import { useAuthStore } from '@/stores/authStore';
import { ApiClient, ApiError } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in?: number;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in?: number;
}

export interface ApiErrorResponse {
  detail: string;
}

/**
 * Create authenticated API client using the auth store token
 * Currently unused but will be needed for future API calls
 */
// function createAuthenticatedApiClient() {
//   return new ApiClient({
//     getToken: () => {
//       const { token } = useAuthStore.getState();
//       return token;
//     },
//   });
// }

/**
 * Login with email and password
 * Returns user data and token on success
 */
export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const apiClient = new ApiClient();

  try {
    const response = await apiClient.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle specific API errors
      if (error.status === 401) {
        throw new Error('Invalid email or password');
      }
      if (error.status === 422) {
        throw new Error('Please check your email and password format');
      }
      if (error.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
    }

    // Generic error fallback
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Login failed. Please try again.',
    );
  }
}

/**
 * Refresh access token using refresh token
 * Returns new access token and optionally a new refresh token
 */
export async function refreshAccessToken(): Promise<RefreshTokenResponse> {
  const { refreshToken } = useAuthStore.getState();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const apiClient = new ApiClient();

  try {
    const response = await apiClient.request<RefreshTokenResponse>(
      '/auth/refresh',
      {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      },
    );

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle specific API errors
      if (error.status === 401) {
        throw new Error('Refresh token expired or invalid');
      }
      if (error.status >= 500) {
        throw new Error(
          'Server error during token refresh. Please try again later.',
        );
      }
    }

    // Generic error fallback
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Token refresh failed. Please login again.',
    );
  }
}

/**
 * Store login response data in auth store with proper token expiration
 */
export function storeLoginResponse(response: LoginResponse): void {
  const { setAuth } = useAuthStore.getState();

  // Calculate expiration timestamp if expires_in is provided
  let expiresAt: number | undefined;
  if (response.expires_in) {
    expiresAt = Date.now() + response.expires_in * 1000;
  } else {
    // Fallback to JWT expiration if no expires_in provided
    expiresAt = getTokenExpiration(response.access_token) || undefined;
  }

  setAuth(
    response.user,
    response.access_token,
    response.refresh_token,
    expiresAt,
  );
}

/**
 * Logout the current user
 * Clears auth state and token
 */
export function logout(): void {
  const { clearAuth } = useAuthStore.getState();
  clearAuth();
}

/**
 * Check if user is currently authenticated
 */
export function isAuthenticated(): boolean {
  const { isAuthenticated } = useAuthStore.getState();
  return isAuthenticated;
}

/**
 * Get current user data
 */
export function getCurrentUser() {
  const { user } = useAuthStore.getState();
  return user;
}

/**
 * Verify token validity and refresh user data if needed
 * Makes a call to /auth/me endpoint to validate the token with the server
 */
export async function verifyToken(): Promise<boolean> {
  try {
    const { token } = useAuthStore.getState();

    if (!token) {
      return false;
    }

    // Check if token is expired before making API call
    if (isTokenExpired(token)) {
      logout();
      return false;
    }

    // Validate token with the server
    const apiClient = new ApiClient({
      getToken: () => token,
    });

    await apiClient.request('/auth/me');
    return true;
  } catch (error) {
    // Token is invalid, clear auth state
    console.error('Token verification failed:', error);
    logout();
    return false;
  }
}

/**
 * Parse JWT token to extract user information and expiration
 * Note: This is for client-side parsing only, server validation is still required
 */
export function parseJWTPayload(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT payload:', error);
    return null;
  }
}

/**
 * Check if a JWT token is expired
 * Returns true if the token is expired or invalid
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = parseJWTPayload(token);
    if (!payload || typeof payload.exp !== 'number') {
      return true; // Invalid token or no expiration
    }

    // JWT exp is in seconds, Date.now() is in milliseconds
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();

    // Add a 30-second buffer to avoid edge cases
    const bufferTime = 30 * 1000;

    return currentTime + bufferTime >= expirationTime;
  } catch {
    return true; // Invalid token
  }
}

/**
 * Get token expiration timestamp from JWT
 * Returns null if token is invalid or has no expiration
 */
export function getTokenExpiration(token: string): number | null {
  try {
    const payload = parseJWTPayload(token);
    if (!payload || typeof payload.exp !== 'number') {
      return null;
    }

    // Convert JWT exp (seconds) to milliseconds timestamp
    return payload.exp * 1000;
  } catch {
    return null;
  }
}

/**
 * Calculate how much time until token expires
 * Returns time in milliseconds, or 0 if already expired
 */
export function getTimeUntilExpiration(token: string): number {
  const expirationTime = getTokenExpiration(token);
  if (!expirationTime) {
    return 0;
  }

  const timeUntilExpiration = expirationTime - Date.now();
  return Math.max(0, timeUntilExpiration);
}
