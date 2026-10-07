import { queryOptions } from '@tanstack/react-query';
import { fetchClients } from './clients.api';

export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (q = '') => [...clientKeys.lists(), { q }] as const,
};

export const clientsQueries = {
  list: (q = '') =>
    queryOptions({
      queryKey: clientKeys.list(q),
      queryFn: () => fetchClients(q),
    }),
};
