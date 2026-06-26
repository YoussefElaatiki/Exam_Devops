import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/client';
import type { User, AuthState } from '../types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await api.post<{ user: User; token: string }>('/auth/login', {
          email,
          password,
        });
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },

      register: async (email: string, username: string, password: string) => {
        const response = await api.post<{ user: User; token: string }>('/auth/register', {
          email,
          username,
          password,
        });
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
