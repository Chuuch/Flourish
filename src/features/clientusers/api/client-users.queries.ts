import { queryOptions } from '@tanstack/react-query';
import { fetchClientUsers } from './client-users.api';

export const clientUserKeys = {
  all: ['client-users'] as const,
  lists: (clientId: string) => [...clientUserKeys.all, 'list', clientId] as const,
  list: (clientId: string, q = '') => [...clientUserKeys.lists(clientId), { q }] as const,
};

export const clientUsersQueries = {
  list: (clientId: string, q = '') =>
    queryOptions({
      queryKey: clientUserKeys.list(clientId, q),
      queryFn: () => fetchClientUsers(clientId, q),
    }),
};
