import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth';
import { markNotificationRead } from '../api/notifications.api';
import { notificationKeys } from '../api/notifications.queries';
import { navKeys } from '@/features/nav/api/nav.queries';

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const portal = useAuthStore((state) => state.role) === 'client';

  return useMutation({
    mutationFn: (id: string) => markNotificationRead(portal, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.list(portal) });
      void queryClient.invalidateQueries({ queryKey: navKeys.counts(portal) });
    },
  });
}
