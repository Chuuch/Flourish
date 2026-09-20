import { useQuery } from '@tanstack/react-query';
import { timeEntriesQueries } from '../api/time-entries.queries';

export function useTimeEntries(taskId: string) {
  return useQuery(timeEntriesQueries.list(taskId));
}
