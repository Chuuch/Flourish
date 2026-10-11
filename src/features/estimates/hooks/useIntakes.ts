import { useInfiniteQuery } from '@tanstack/react-query';
import { estimateQueries } from '../api/estimates.queries';

export function useIntake(status = '') {
  return useInfiniteQuery(estimateQueries.intakes(status));
}
