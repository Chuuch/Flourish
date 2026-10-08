import { useInfiniteQuery } from '@tanstack/react-query';
import { activityQueries } from '../api/activity.queries';

export function useActivity() {
  return useInfiniteQuery(activityQueries.list());
}
