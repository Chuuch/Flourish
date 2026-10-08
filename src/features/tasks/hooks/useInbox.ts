import { useInfiniteQuery } from '@tanstack/react-query';
import { tasksQueries } from '../api/tasks.queries';

export function useInbox(q = '') {
  return useInfiniteQuery(tasksQueries.inbox(q));
}
