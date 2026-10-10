import { useQuery } from '@tanstack/react-query';
import { estimateQueries } from '../api/estimates.queries';

export function useEstimate(estimateId: string) {
  return useQuery(estimateQueries.detail(estimateId));
}
