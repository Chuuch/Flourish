import { useQuery } from '@tanstack/react-query';
import { tasksQueries } from '../api/tasks.queries';

export function useInbox() {
  return useQuery(tasksQueries.inbox());
}
