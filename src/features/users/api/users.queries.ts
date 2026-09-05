import { queryOptions } from '@tanstack/react-query';
import { fetchUser, fetchUsers } from './users.api';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};

export const usersQueries = {
  list: () =>
    queryOptions({
      queryKey: userKeys.lists(),
      queryFn: fetchUsers,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: userKeys.detail(id),
      queryFn: () => fetchUser(id),
    }),
};
