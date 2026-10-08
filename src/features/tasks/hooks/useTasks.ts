import { useInfiniteQuery } from '@tanstack/react-query';
import { tasksQueries } from '../api/tasks.queries';

export function useTasks(projectId: string, q = '') {
  return useInfiniteQuery(tasksQueries.list(projectId, q));
}
