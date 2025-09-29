import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  tokenExpiresAt: number | null;
}

interface AuthActions {
  setAuth: (
    user: User,
    token: string,
    refreshToken?: string,
    expiresAt?: number,
  ) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
  updateTokens: (
    token: string,
    refreshToken?: string,
    expiresAt?: number,
  ) => void;
}

type AuthStore = AuthState & AuthActions;

const TOKEN_KEY = 'senda_auth_token';
const REFRESH_TOKEN_KEY = 'senda_refresh_token';
const TOKEN_EXPIRES_KEY = 'senda_token_expires';
const USER_KEY = 'senda_auth_user';

export const useAuthStore = create<AuthStore>((set, _get) => ({
  // Initial state
  user: null,
  token: null,
  refreshToken: null,
  isLoading: true,
  isAuthenticated: false,
  tokenExpiresAt: null,

  // Actions
  setAuth: (
    user: User,
    token: string,
    refreshToken?: string,
    expiresAt?: number,
  ) => {
    // Store in localStorage
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }

    if (expiresAt) {
      localStorage.setItem(TOKEN_EXPIRES_KEY, expiresAt.toString());
    }

    set({
      user,
      token,
      refreshToken: refreshToken || null,
      isAuthenticated: true,
      isLoading: false,
      tokenExpiresAt: expiresAt || null,
    });
  },

  clearAuth: () => {
    // Clear from localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRES_KEY);
    localStorage.removeItem(USER_KEY);

    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      tokenExpiresAt: null,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  updateTokens: (token: string, refreshToken?: string, expiresAt?: number) => {
    // Update localStorage
    localStorage.setItem(TOKEN_KEY, token);

    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }

    if (expiresAt) {
      localStorage.setItem(TOKEN_EXPIRES_KEY, expiresAt.toString());
    }

    set({
      token,
      refreshToken: refreshToken || null,
      tokenExpiresAt: expiresAt || null,
    });
  },

  initializeAuth: () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const tokenExpiresStr = localStorage.getItem(TOKEN_EXPIRES_KEY);
      const userStr = localStorage.getItem(USER_KEY);

      if (token && userStr) {
        const user = JSON.parse(userStr) as User;
        const tokenExpiresAt = tokenExpiresStr
          ? parseInt(tokenExpiresStr, 10)
          : null;

        set({
          user,
          token,
          refreshToken,
          tokenExpiresAt,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          token: null,
          refreshToken: null,
          tokenExpiresAt: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      // Clear potentially corrupted data
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRES_KEY);
      localStorage.removeItem(USER_KEY);

      set({
        user: null,
        token: null,
        refreshToken: null,
        tokenExpiresAt: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
