import { projectKeys } from '@/features/projects';
import { queryOptions } from '@tanstack/react-query';
import { fetchInbox, fetchTasks } from './tasks.api';

export const taskKeys = {
  all: ['tasks'] as const,
  lists: (projectId: string) => [...projectKeys.all, 'lists', projectId] as const,
  list: (projectId: string, q = '') => [...taskKeys.lists(projectId), { q }] as const,
  inbox: () => [...taskKeys.all, 'inbox'] as const,
  inboxList: (q = '') => [...taskKeys.inbox(), { q }] as const,
};

export const tasksQueries = {
  list: (projectId: string, q = '') =>
    queryOptions({
      queryKey: taskKeys.list(projectId, q),
      queryFn: () => fetchTasks(projectId, q),
    }),
  inbox: (q = '') =>
    queryOptions({
      queryKey: taskKeys.inboxList(q),
      queryFn: () => fetchInbox(q),
    }),
};
