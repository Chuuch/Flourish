import { queryOptions } from '@tanstack/react-query';
import { fetchClientUsers } from './client-users.api';

export const clientUserKeys = {
  all: ['client-users'] as const,
  lists: (clientId: string) => [...clientUserKeys.all, 'list', clientId] as const,
};

export const clientUsersQueries = {
  list: (clientId: string) =>
    queryOptions({
      queryKey: clientUserKeys.lists(clientId),
      queryFn: () => fetchClientUsers(clientId),
    }),
};
