import { create } from 'zustand';
import { setAccessToken, setAuthRealm } from '@/lib/api/client';
import type { SessionOrganization, SessionRole, SessionUser } from '../schemas/auth.schema';
import type { SessionClient } from '@/features/portal/schemas/portal-auth.schema';

type AuthRole = SessionRole | 'client';

interface AuthState {
  user: SessionUser | null;
  organization: SessionOrganization | null;
  client: SessionClient | null;
  role: AuthRole | null;
  setSession: (
    user: SessionUser,
    access_token: string,
    organization: SessionOrganization,
    role: SessionRole,
  ) => void;
  setPortalSession: (
    user: SessionUser,
    access_token: string,
    organization: SessionOrganization,
    client: SessionClient,
    role: 'client',
  ) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  organization: null,
  client: null,
  role: null,
  setSession: (user, access_token, organization, role) => {
    setAccessToken(access_token);
    setAuthRealm('agency');
    set({ user, organization, client: null, role });
  },
  setPortalSession: (user, access_token, organization, client, role) => {
    setAccessToken(access_token);
    setAuthRealm('portal');
    set({ user, organization, client, role });
  },
  clearSession: () => {
    setAccessToken(null);
    setAuthRealm(null);
    set({ user: null, organization: null, client: null, role: null });
  },
}));
