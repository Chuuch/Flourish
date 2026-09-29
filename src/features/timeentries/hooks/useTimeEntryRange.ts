import { useQuery } from '@tanstack/react-query';
import { timeEntriesQueries } from '../api/time-entries.queries';

export function useTimeEntryRange(from: string, to: string) {
  return useQuery(timeEntriesQueries.range(from, to));
}
