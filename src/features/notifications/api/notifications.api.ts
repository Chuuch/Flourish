import { z } from 'zod';
import { http } from '@/lib/api/http';
import { notificationPageSchema } from '../schemas/notification.schema';

const DEFAULT_LIMIT = 50;

const listPath = (portal: boolean) => (portal ? '/client-auth/notifications' : '/notifications');

const readPath = (portal: boolean, id: string) =>
  portal ? `/client-auth/notifications/${id}/read` : `/notifications/${id}/read`;

export const fetchNotifications = (portal: boolean, params?: { cursor?: string; limit?: number }) =>
  http.get(listPath(portal), notificationPageSchema, {
    params: {
      limit: params?.limit ?? DEFAULT_LIMIT,
      ...(params?.cursor ? { cursor: params.cursor } : {}),
    },
  });

export const markNotificationRead = (portal: boolean, id: string) =>
  http.patch(readPath(portal, id), z.unknown());
