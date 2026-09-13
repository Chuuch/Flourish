import { create } from 'zustand';
import { setAccessToken } from '@/lib/api/client';
import type { SessionOrganization, SessionRole, SessionUser } from '../schemas/auth.schema';

interface AuthState {
  user: SessionUser | null;
  organization: SessionOrganization | null;
  role: SessionRole | null;
  setSession: (
    user: SessionUser,
    access_token: string,
    organization: SessionOrganization,
    role: SessionRole,
  ) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  organization: null,
  role: null,
  setSession: (user, access_token, organization, role) => {
    setAccessToken(access_token);
    set({ user, organization, role });
  },
  clearSession: () => {
    setAccessToken(null);
    set({ user: null, organization: null, role: null });
  },
}));
