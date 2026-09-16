import { queryOptions } from '@tanstack/react-query';
import { fetchTimeEntries } from './time-entries.api';

export const timeEntryKeys = {
  all: ['time-entries'] as const,
  lists: (taskId: string) => [...timeEntryKeys.all, 'list', taskId] as const,
};

export const timeEntriesQueries = {
  list: (taskId: string) =>
    queryOptions({
      queryKey: timeEntryKeys.lists(taskId),
      queryFn: () => fetchTimeEntries(taskId),
    }),
};
