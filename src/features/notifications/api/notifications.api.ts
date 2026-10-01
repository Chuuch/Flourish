import { z } from 'zod';
import { http } from '@/lib/api/http';
import { notificationsSchema } from '../schemas/notification.schema';

const listPath = (portal: boolean) => (portal ? '/client-auth/notifications' : '/notifications');

const readPath = (portal: boolean, id: string) =>
  portal ? `/client-auth/notifications/${id}/read` : `/notifications/${id}/read`;

export const fetchNotifications = (portal: boolean) =>
  http.get(listPath(portal), notificationsSchema);

export const markNotificationRead = (portal: boolean, id: string) =>
  http.patch(readPath(portal, id), z.unknown());
