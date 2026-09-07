import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store';
import { fetchSession } from '../api/auth.api';

export function useBootstrapSession() {
  const setSession = useAuthStore((state) => state.setSession);

  return useQuery({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      const session = await fetchSession();
      setSession(session.user, session.accessToken);
      return session.user;
    },
    retry: false,
    staleTime: Infinity,
  });
}
