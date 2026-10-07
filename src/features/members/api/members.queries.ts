import { queryOptions } from '@tanstack/react-query';
import { fetchMembers } from './members.api';

export const memberKeys = {
  all: ['members'] as const,
  lists: () => [...memberKeys.all, 'list'] as const,
  list: (q = '') => [...memberKeys.lists(), { q }] as const,
};

export const membersQueries = {
  list: (q = '') =>
    queryOptions({
      queryKey: memberKeys.list(q),
      queryFn: () => fetchMembers(q),
    }),
};
