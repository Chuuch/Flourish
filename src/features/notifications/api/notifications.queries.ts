import { queryOptions } from '@tanstack/react-query';
import { fetchNotifications } from './notifications.api';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (portal: boolean) => [...notificationKeys.all, 'list', portal] as const,
};

export const notificationQueries = {
  list: (portal: boolean) =>
    queryOptions({
      queryKey: notificationKeys.list(portal),
      queryFn: () => fetchNotifications(portal),
    }),
};
