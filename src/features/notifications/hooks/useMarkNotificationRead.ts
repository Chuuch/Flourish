import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth';
import { markNotificationRead } from '../api/notifications.api';
import { notificationKeys } from '../api/notifications.queries';
import { navKeys } from '@/features/nav/api/nav.queries';
import type { NotificationPage } from '../schemas/notification.schema';

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const portal = useAuthStore((state) => state.role) === 'client';
  const listKey = notificationKeys.list(portal);

  return useMutation({
    mutationFn: (id: string) => markNotificationRead(portal, id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      const previous = queryClient.getQueryData<InfiniteData<NotificationPage>>(listKey);

      queryClient.setQueryData<InfiniteData<NotificationPage>>(listKey, (current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          pages: current.pages.map((page) => ({
            ...page,
            items: page.items.filter((item) => item.id !== id),
          })),
        };
      });

      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(listKey, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: listKey });
      void queryClient.invalidateQueries({ queryKey: navKeys.counts(portal) });
    },
  });
}
