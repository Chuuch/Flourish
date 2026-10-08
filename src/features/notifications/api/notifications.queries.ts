import { infiniteQueryOptions } from '@tanstack/react-query';
import { fetchNotifications } from './notifications.api';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (portal: boolean) => [...notificationKeys.all, 'list', portal] as const,
};

export const notificationQueries = {
  list: (portal: boolean) =>
    infiniteQueryOptions({
      queryKey: notificationKeys.list(portal),
      queryFn: ({ pageParam }) =>
        fetchNotifications(portal, {
          ...(pageParam ? { cursor: pageParam } : {}),
        }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    }),
};
