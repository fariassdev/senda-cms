import Cookies from 'js-cookie';
import { create } from 'zustand';

interface User {
  email: string;
  username: string;
  name: string | null;
  bio: string | null;
  image: string | null;
  token: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

const TOKEN_KEY = 'senda_auth_token';
const USER_KEY = 'senda_auth_user';
const AUTH_SYNC_EVENT = 'senda_auth_sync';

/**
 * Broadcast auth state changes to other tabs
 * Uses a custom event to notify other tabs of auth changes
 */
function broadcastAuthChange(action: 'login' | 'logout') {
  if (typeof window !== 'undefined') {
    // Dispatch a custom storage event to notify other tabs
    const event = new StorageEvent('storage', {
      key: AUTH_SYNC_EVENT,
      newValue: action,
      oldValue: null,
    });
    window.dispatchEvent(event);
  }
}

export const useAuthStore = create<AuthStore>((set, _get) => ({
  // Initial state
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  // Actions
  setAuth: (user: User, token: string) => {
    // Store in localStorage
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    // Also store in cookies for server-side access
    Cookies.set('senda_auth_token', token, {
      expires: 30, // 30 days
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });

    // Broadcast login to other tabs
    broadcastAuthChange('login');
  },

  clearAuth: () => {
    // Clear from localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    // Clear cookies
    Cookies.remove('senda_auth_token');

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });

    // Broadcast logout to other tabs
    broadcastAuthChange('logout');
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  initializeAuth: () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const userStr = localStorage.getItem(USER_KEY);

      if (token && userStr) {
        const user = JSON.parse(userStr) as User;

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      // Clear potentially corrupted data
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
