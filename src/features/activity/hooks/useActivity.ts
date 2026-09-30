import { useQuery } from '@tanstack/react-query';
import { activityQueries } from '../api/activity.queries';

export function useActivity() {
  return useQuery(activityQueries.list());
}
