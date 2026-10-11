import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import {
  fetchEstimate,
  fetchEstimateCatalog,
  fetchEstimates,
  fetchIntake,
  fetchIntakes,
  fetchPublicIntake,
} from './estimates.api';

export const estimateKeys = {
  all: ['estimates'] as const,
  catalog: () => [...estimateKeys.all, 'catalog'] as const,
  list: () => [...estimateKeys.all, 'list'] as const,
  listQuery: (clientId = '') => [...estimateKeys.list(), { clientId }] as const,
  detail: (estimateId: string) => [...estimateKeys.all, 'detail', estimateId] as const,
  intakes: () => [...estimateKeys.all, 'intakes'] as const,
  intakesQuery: (status = '') => [...estimateKeys.intakes(), { status }] as const,
  intakeDetail: (intakeId: string) => [...estimateKeys.all, 'intake', intakeId] as const,
  publicIntake: (token: string) => [...estimateKeys.all, 'public-intake', token] as const,
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
  intakes: (status = '') =>
    infiniteQueryOptions({
      queryKey: estimateKeys.intakesQuery(status),
      queryFn: ({ pageParam }) =>
        fetchIntakes({
          ...(status ? { status } : {}),
          ...(pageParam ? { cursor: pageParam } : {}),
        }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    }),
  intakeDetail: (intakeId: string) =>
    queryOptions({
      queryKey: estimateKeys.intakeDetail(intakeId),
      queryFn: () => fetchIntake(intakeId),
    }),
  publicIntake: (token: string) =>
    queryOptions({
      queryKey: estimateKeys.publicIntake(token),
      queryFn: () => fetchPublicIntake(token),
      retry: false,
    }),
};
