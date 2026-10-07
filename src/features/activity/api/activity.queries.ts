import { infiniteQueryOptions } from '@tanstack/react-query';
import { fetchActivity } from './activity.api';

export const activityKeys = {
  all: ['activity'] as const,
  lists: () => [...activityKeys.all, 'list'] as const,
};

export const activityQueries = {
  list: () =>
    infiniteQueryOptions({
      queryKey: activityKeys.lists(),
      queryFn: ({ pageParam }) =>
        fetchActivity({
          ...(pageParam ? { cursor: pageParam } : {}),
        }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    }),
};
