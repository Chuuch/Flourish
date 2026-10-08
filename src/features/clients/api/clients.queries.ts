import { infiniteQueryOptions } from '@tanstack/react-query';
import { fetchClients } from './clients.api';

export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (q = '') => [...clientKeys.lists(), { q }] as const,
};

export const clientsQueries = {
  list: (q = '') =>
    infiniteQueryOptions({
      queryKey: clientKeys.list(q),
      queryFn: ({ pageParam }) =>
        fetchClients({
          ...(q ? { q } : {}),
          ...(pageParam ? { cursor: pageParam } : {}),
        }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    }),
};
