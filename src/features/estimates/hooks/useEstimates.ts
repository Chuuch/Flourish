import { useInfiniteQuery } from '@tanstack/react-query';
import { estimateQueries } from '../api/estimates.queries';

export function useEstimates(clientId = '') {
  return useInfiniteQuery(estimateQueries.list(clientId));
}
