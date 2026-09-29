import { create } from 'zustand';
import { setAccessToken, setAuthRealm } from '@/lib/api/client';
import type { z } from 'zod';
import {
  sessionUserSchema,
  type SessionOrganization,
  type SessionRole,
  type SessionUser,
} from '../schemas/auth.schema';
import type { SessionClient } from '@/features/portal/schemas/portal-auth.schema';

type AuthRole = SessionRole | 'client';
type SessionUserInput = z.input<typeof sessionUserSchema>;

function toSessionUser(user: SessionUserInput): SessionUser {
  return {
    ...user,
    display_name: user.display_name ?? '',
  };
}

interface AuthState {
  user: SessionUser | null;
  organization: SessionOrganization | null;
  client: SessionClient | null;
  role: AuthRole | null;
  setSession: (
    user: SessionUserInput,
    access_token: string,
    organization: SessionOrganization,
    role: SessionRole,
  ) => void;
  setPortalSession: (
    user: SessionUserInput,
    access_token: string,
    organization: SessionOrganization,
    client: SessionClient,
    role: 'client',
  ) => void;
  setSessionUser: (user: SessionUser) => void;
  setSessionOrganization: (organization: SessionOrganization) => void;
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
    set({ user: toSessionUser(user), organization, client: null, role });
  },
  setPortalSession: (user, access_token, organization, client, role) => {
    setAccessToken(access_token);
    setAuthRealm('portal');
    set({ user: toSessionUser(user), organization, client, role });
  },
  setSessionUser: (user) => {
    set({ user });
  },
  setSessionOrganization: (organization) => {
    set({ organization });
  },
  clearSession: () => {
    setAccessToken(null);
    setAuthRealm(null);
    set({ user: null, organization: null, client: null, role: null });
  },
}));
