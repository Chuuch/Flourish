import { queryOptions } from '@tanstack/react-query';
import { fetchActivity } from './activity.api';

export const activityKeys = {
  all: ['activity'] as const,
  lists: () => [...activityKeys.all, 'list'] as const,
};

export const activityQueries = {
  list: () =>
    queryOptions({
      queryKey: activityKeys.lists(),
      queryFn: fetchActivity,
      refetchInterval: 20_000,
    }),
};
