import { useAuthStore } from '@/features/auth';
import { useQuery } from '@tanstack/react-query';
import { navQueries } from '../api/nav.queries';

export function useNavCounts() {
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const portal = role === 'client';

  return useQuery({
    ...navQueries.counts(portal),
    enabled: Boolean(user && role),
  });
}
