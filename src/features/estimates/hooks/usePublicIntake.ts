import { useQuery } from '@tanstack/react-query';
import { estimateQueries } from '../api/estimates.queries';

export function usePublicIntake(token: string) {
  return useQuery({
    ...estimateQueries.publicIntake(token),
    enabled: token.length > 0,
  });
}
