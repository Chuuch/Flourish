import { projectKeys } from '@/features/projects';
import { queryOptions } from '@tanstack/react-query';
import { fetchInbox, fetchTasks } from './tasks.api';

export const taskKeys = {
  all: ['tasks'] as const,
  lists: (projectId: string) => [...projectKeys.all, 'lists', projectId] as const,
  inbox: () => [...taskKeys.all, 'inbox'] as const,
};

export const tasksQueries = {
  list: (projectId: string) =>
    queryOptions({
      queryKey: taskKeys.lists(projectId),
      queryFn: () => fetchTasks(projectId),
    }),
  inbox: () =>
    queryOptions({
      queryKey: taskKeys.inbox(),
      queryFn: fetchInbox,
    }),
};
