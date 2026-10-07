import { useQuery } from '@tanstack/react-query';
import { tasksQueries } from '../api/tasks.queries';

export function useTasks(projectId: string, q = '') {
  return useQuery(tasksQueries.list(projectId, q));
}
