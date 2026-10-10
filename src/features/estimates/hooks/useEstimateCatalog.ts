import { useQuery } from '@tanstack/react-query';
import { estimateQueries } from '../api/estimates.queries';

export function useEstimateCatalog() {
  return useQuery(estimateQueries.catalog());
}
