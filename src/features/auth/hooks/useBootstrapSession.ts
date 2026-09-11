import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store';
import { fetchSession } from '../api/auth.api';
import { authKeys } from '../api/auth.queries';

export function useBootstrapSession() {
  const setSession = useAuthStore((state) => state.setSession);

  return useQuery({
    queryKey: authKeys.session(),
    queryFn: async () => {
      const session = await fetchSession();
      setSession(session.user, session.access_token, session.organization);
      return session.user;
    },
    retry: false,
    staleTime: Infinity,
  });
}
