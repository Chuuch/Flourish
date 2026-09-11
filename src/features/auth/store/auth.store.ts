import { create } from 'zustand';
import { setAccessToken } from '@/lib/api/client';
import type { SessionOrganization, SessionUser } from '../schemas/auth.schema';

interface AuthState {
  user: SessionUser | null;
  organization: SessionOrganization | null;
  setSession: (user: SessionUser, access_token: string, organization: SessionOrganization) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  organization: null,
  setSession: (user, access_token, organization) => {
    setAccessToken(access_token);
    set({ user, organization });
  },
  clearSession: () => {
    setAccessToken(null);
    set({ user: null, organization: null });
  },
}));
