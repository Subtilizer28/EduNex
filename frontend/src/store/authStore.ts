import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  refreshUser: (user: User) => void;
  isTokenValid: () => boolean;
}

// Helper function to decode JWT and check expiration
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch {
    return true;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        // Store in both localStorage and Zustand state
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        // Clear all auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('auth-storage');
        set({ user: null, token: null, isAuthenticated: false });
      },
      refreshUser: (user) => {
        // Update user data without changing token
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
      },
      isTokenValid: () => {
        const { token } = get();
        if (!token) return false;
        return !isTokenExpired(token);
      },
    }),
    {
      name: 'auth-storage',
      // Rehydrate state from localStorage on app load
      onRehydrateStorage: () => (state) => {
        // Validate token on rehydration
        if (state?.token && isTokenExpired(state.token)) {
          state.logout();
        }
      },
    }
  )
);
