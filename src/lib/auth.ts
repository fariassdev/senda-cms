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
  token_type: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
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
 * This would typically make a call to a /me or /verify endpoint
 */
export async function verifyToken(): Promise<boolean> {
  try {
    // TODO: Replace with actual /me endpoint when available
    // For now, just check if we have a token
    const { token } = useAuthStore.getState();

    if (!token) {
      return false;
    }

    // In a real implementation, you would validate the token with the server:
    // const apiClient = createAuthenticatedApiClient();
    // await apiClient.request("/auth/me");

    return true;
  } catch {
    // Token is invalid, clear auth state
    logout();
    return false;
  }
}

/**
 * Parse JWT token to extract user information
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
