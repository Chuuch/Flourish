import { create } from 'zustand';
import { setAccessToken } from '@/lib/api/client';
import type { SessionUser } from '../schemas/auth.schema';

interface AuthState {
  user: SessionUser | null;
  setSession: (user: SessionUser, access_token: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setSession: (user, access_token) => {
    setAccessToken(access_token);
    set({ user });
  },
  clearSession: () => {
    setAccessToken(null);
    set({ user: null });
  },
}));
