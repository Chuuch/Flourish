import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store';
import { fetchSession } from '../api/auth.api';
import { authKeys } from '../api/auth.queries';
import {
  allowRefreshAttempt,
  getAccessToken,
  refreshAccessToken,
  setAccessToken,
  setAuthRealm,
} from '@/lib/api/client';
import { fetchPortalSession } from '@/features/portal/api/portal-auth.api';

export function useBootstrapSession() {
  const setSession = useAuthStore((state) => state.setSession);
  const setPortalSession = useAuthStore((state) => state.setPortalSession);

  return useQuery({
    queryKey: authKeys.session(),
    queryFn: async () => {
      const restoreAgency = async () => {
        setAuthRealm('agency');
        allowRefreshAttempt();
        if (!getAccessToken()) {
          await refreshAccessToken();
        }
        const session = await fetchSession();
        setSession(session.user, session.access_token, session.organization, session.role);
        return session.user;
      };

      const restorePortal = async () => {
        setAccessToken(null);
        setAuthRealm('portal');
        allowRefreshAttempt();
        await refreshAccessToken();
        const session = await fetchPortalSession();
        setPortalSession(
          session.user,
          session.access_token,
          session.organization,
          session.client,
          session.role,
        );
        return session.user;
      };

      try {
        return await restoreAgency();
      } catch {
        try {
          return await restorePortal();
        } catch (error) {
          setAccessToken(null);
          setAuthRealm(null);
          throw error;
        }
      }
    },
    retry: false,
    staleTime: Infinity,
  });
}
