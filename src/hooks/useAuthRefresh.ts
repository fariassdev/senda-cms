/**
 * Custom hook for automatic token refresh management
 * Handles background token refresh, cross-tab synchronization, and session management
 */

import { useEffect, useRef, useCallback } from 'react';

import {
  refreshAccessToken,
  logout,
  isTokenExpired,
  getTimeUntilExpiration,
  getTokenExpiration,
} from '@/lib/auth';
import { useAuthStore } from '@/stores/authStore';

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
const REFRESH_THRESHOLD = 10 * 60 * 1000; // Refresh when 10 minutes left

export function useAuthRefresh() {
  const { token, refreshToken, isAuthenticated, updateTokens } = useAuthStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshing = useRef(false);

  /**
   * Attempt to refresh the access token
   * Returns true if successful, false otherwise
   */
  const performTokenRefresh = useCallback(async (): Promise<boolean> => {
    if (isRefreshing.current || !refreshToken || !isAuthenticated) {
      return false;
    }

    isRefreshing.current = true;

    try {
      console.log('Refreshing access token...');
      const response = await refreshAccessToken();

      // Calculate expiration timestamp if expires_in is provided
      const expiresAt = response.expires_in
        ? Date.now() + response.expires_in * 1000
        : getTokenExpiration(response.access_token);

      // Update tokens in store
      updateTokens(
        response.access_token,
        response.refresh_token || refreshToken, // Use new refresh token if provided, else keep current
        expiresAt || undefined,
      );

      console.log('Token refreshed successfully');
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);

      // If refresh fails, logout the user
      logout();
      return false;
    } finally {
      isRefreshing.current = false;
    }
  }, [refreshToken, isAuthenticated, updateTokens]);

  /**
   * Check if token needs refresh and perform it if necessary
   */
  const checkAndRefreshToken = useCallback(async () => {
    if (!token || !isAuthenticated) {
      return;
    }

    // Check if token is expired or close to expiring
    if (isTokenExpired(token)) {
      console.log('Token is expired, attempting refresh...');
      await performTokenRefresh();
    } else {
      const timeUntilExpiration = getTimeUntilExpiration(token);

      // If token expires within threshold, refresh it
      if (timeUntilExpiration <= REFRESH_THRESHOLD) {
        console.log('Token expires soon, attempting refresh...');
        await performTokenRefresh();
      }
    }
  }, [token, isAuthenticated, performTokenRefresh]);

  /**
   * Handle window focus - check token status when user returns to tab
   */
  const handleWindowFocus = useCallback(() => {
    checkAndRefreshToken();
  }, [checkAndRefreshToken]);

  /**
   * Handle localStorage changes from other tabs (cross-tab synchronization)
   */
  const handleStorageChange = useCallback((event: StorageEvent) => {
    // Only handle auth-related storage changes
    if (
      event.key?.startsWith('senda_auth') ||
      event.key?.startsWith('senda_refresh') ||
      event.key?.startsWith('senda_token')
    ) {
      // Re-initialize auth state from localStorage
      useAuthStore.getState().initializeAuth();
    }
  }, []);

  /**
   * Start the periodic token refresh interval
   */
  const startRefreshInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      checkAndRefreshToken();
    }, REFRESH_INTERVAL);
  }, [checkAndRefreshToken]);

  /**
   * Stop the periodic token refresh interval
   */
  const stopRefreshInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Set up effects for token management
  useEffect(() => {
    if (isAuthenticated && token) {
      // Start periodic refresh when authenticated
      startRefreshInterval();

      // Check token immediately on mount/auth change
      checkAndRefreshToken();

      // Listen for window focus events
      window.addEventListener('focus', handleWindowFocus);

      // Listen for localStorage changes (cross-tab sync)
      window.addEventListener('storage', handleStorageChange);

      return () => {
        window.removeEventListener('focus', handleWindowFocus);
        window.removeEventListener('storage', handleStorageChange);
      };
    } else {
      // Stop refresh when not authenticated
      stopRefreshInterval();
    }

    return () => {
      stopRefreshInterval();
    };
  }, [
    isAuthenticated,
    token,
    startRefreshInterval,
    stopRefreshInterval,
    checkAndRefreshToken,
    handleWindowFocus,
    handleStorageChange,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRefreshInterval();
    };
  }, [stopRefreshInterval]);

  return {
    performTokenRefresh,
    checkAndRefreshToken,
    isRefreshing: isRefreshing.current,
  };
}
