import { queryOptions } from '@tanstack/react-query';
import { fetchTimeEntries, fetchTimeEntryRange } from './time-entries.api';

export const timeEntryKeys = {
  all: ['time-entries'] as const,
  lists: (taskId: string) => [...timeEntryKeys.all, 'list', taskId] as const,
  range: (from: string, to: string) => [...timeEntryKeys.all, 'range', from, to] as const,
};

export const timeEntriesQueries = {
  list: (taskId: string) =>
    queryOptions({
      queryKey: timeEntryKeys.lists(taskId),
      queryFn: () => fetchTimeEntries(taskId),
    }),
  range: (from: string, to: string) =>
    queryOptions({
      queryKey: timeEntryKeys.range(from, to),
      queryFn: () => fetchTimeEntryRange(from, to),
    }),
};
