import { activityKeys } from '@/features/activity/api/activity.queries';
import { navKeys } from '@/features/nav/api/nav.queries';
import { notificationKeys } from '@/features/notifications/api/notifications.queries';
import type { QueryClient } from '@tanstack/react-query';
import z from 'zod';

export const realtimeEventSchema = z.object({
  channel: z.enum(['activity', 'notification']),
});

export type RealtimeEvent = z.infer<typeof realtimeEventSchema>;

export function applyRealtimeEvent(
  queryClient: QueryClient,
  event: RealtimeEvent,
  portal: boolean,
): void {
  if (event.channel === 'activity' && !portal) {
    void queryClient.invalidateQueries({ queryKey: activityKeys.all });
  }

  if (event.channel === 'notification') {
    void queryClient.invalidateQueries({ queryKey: notificationKeys.list(portal) });
    void queryClient.invalidateQueries({ queryKey: navKeys.counts(portal) });
  }
}

export function catchUpRealtimeQueries(queryClient: QueryClient, portal: boolean): void {
  if (!portal) {
    void queryClient.invalidateQueries({ queryKey: activityKeys.all });
  }
  void queryClient.invalidateQueries({ queryKey: notificationKeys.list(portal) });
  void queryClient.invalidateQueries({ queryKey: navKeys.counts(portal) });
}
