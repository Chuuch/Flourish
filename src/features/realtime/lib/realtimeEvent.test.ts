import { describe, expect, it, vi } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { activityKeys } from '@/features/activity/api/activity.queries';
import { notificationKeys } from '@/features/notifications/api/notifications.queries';
import { applyRealtimeEvent, catchUpRealtimeQueries } from './realtimeEvent';

describe('applyRealtimeEvent', () => {
  it('invalidates activity for staff', () => {
    const queryClient = new QueryClient();
    const spy = vi.spyOn(queryClient, 'invalidateQueries');

    applyRealtimeEvent(queryClient, { channel: 'activity' }, false);

    expect(spy).toHaveBeenCalledWith({ queryKey: activityKeys.all });
  });

  it('ignores activity for portal', () => {
    const queryClient = new QueryClient();
    const spy = vi.spyOn(queryClient, 'invalidateQueries');

    applyRealtimeEvent(queryClient, { channel: 'activity' }, true);

    expect(spy).not.toHaveBeenCalled();
  });

  it('invalidates notifications', () => {
    const queryClient = new QueryClient();
    const spy = vi.spyOn(queryClient, 'invalidateQueries');

    applyRealtimeEvent(queryClient, { channel: 'notification' }, true);

    expect(spy).toHaveBeenCalledWith({ queryKey: notificationKeys.list(true) });
  });
});

describe('catchUpRealtimeQueries', () => {
  it('invalidates staff activity and notifications', () => {
    const queryClient = new QueryClient();
    const spy = vi.spyOn(queryClient, 'invalidateQueries');

    catchUpRealtimeQueries(queryClient, false);

    expect(spy).toHaveBeenCalledWith({ queryKey: activityKeys.all });
    expect(spy).toHaveBeenCalledWith({ queryKey: notificationKeys.list(false) });
  });
});
