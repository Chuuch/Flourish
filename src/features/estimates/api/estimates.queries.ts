import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { fetchEstimate, fetchEstimateCatalog, fetchEstimates } from './estimates.api';

export const estimateKeys = {
  all: ['estimates'] as const,
  catalog: () => [...estimateKeys.all, 'catalog'] as const,
  list: () => [...estimateKeys.all, 'list'] as const,
  listQuery: (clientId = '') => [...estimateKeys.list(), { clientId }] as const,
  detail: (estimateId: string) => [...estimateKeys.all, 'detail', estimateId] as const,
};

export const estimateQueries = {
  catalog: () =>
    queryOptions({
      queryKey: estimateKeys.catalog(),
      queryFn: fetchEstimateCatalog,
    }),
  list: (clientId = '') =>
    infiniteQueryOptions({
      queryKey: estimateKeys.listQuery(clientId),
      queryFn: ({ pageParam }) =>
        fetchEstimates({
          ...(clientId ? { client_id: clientId } : {}),
          ...(pageParam ? { cursor: pageParam } : {}),
        }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    }),
  detail: (estimateId: string) =>
    queryOptions({
      queryKey: estimateKeys.detail(estimateId),
      queryFn: () => fetchEstimate(estimateId),
    }),
};
