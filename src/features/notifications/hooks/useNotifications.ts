import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth';
import { notificationQueries } from '../api/notifications.queries';

export function useNotifications() {
  const portal = useAuthStore((state) => state.role) === 'client';
  return useQuery(notificationQueries.list(portal));
}
