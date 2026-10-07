import { useQuery } from '@tanstack/react-query';
import { tasksQueries } from '../api/tasks.queries';

export function useInbox(q = '') {
  return useQuery(tasksQueries.inbox(q));
}
