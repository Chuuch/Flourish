import { queryOptions } from '@tanstack/react-query';
import { fetchMembers } from './members.api';

export const memberKeys = {
  all: ['members'] as const,
  lists: () => [...memberKeys.all, 'list'] as const,
};

export const membersQueries = {
  list: () =>
    queryOptions({
      queryKey: memberKeys.lists(),
      queryFn: fetchMembers,
    }),
};
