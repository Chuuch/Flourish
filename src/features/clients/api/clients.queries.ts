import { queryOptions } from '@tanstack/react-query';
import { fetchClients } from './clients.api';

export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
};

export const clientsQueries = {
  list: () =>
    queryOptions({
      queryKey: clientKeys.lists(),
      queryFn: fetchClients,
    }),
};
