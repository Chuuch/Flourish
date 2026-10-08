import { projectKeys } from '@/features/projects';
import { infiniteQueryOptions } from '@tanstack/react-query';
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
    infiniteQueryOptions({
      queryKey: taskKeys.list(projectId, q),
      queryFn: ({ pageParam }) =>
        fetchTasks(projectId, {
          ...(q ? { q } : {}),
          ...(pageParam ? { cursor: pageParam } : {}),
        }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    }),
  inbox: (q = '') =>
    infiniteQueryOptions({
      queryKey: taskKeys.inboxList(q),
      queryFn: ({ pageParam }) =>
        fetchInbox({
          ...(q ? { q } : {}),
          ...(pageParam ? { cursor: pageParam } : {}),
        }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    }),
};
