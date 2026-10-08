import { infiniteQueryOptions } from '@tanstack/react-query';
import { fetchProjects } from './projects.api';

export const projectKeys = {
  all: ['projects'] as const,
  lists: (clientId: string) => [...projectKeys.all, 'list', clientId] as const,
  list: (clientId: string, q = '') => [...projectKeys.lists(clientId), { q }] as const,
};

export const projectsQueries = {
  list: (clientId: string, q = '') =>
    infiniteQueryOptions({
      queryKey: projectKeys.list(clientId, q),
      queryFn: ({ pageParam }) =>
        fetchProjects(clientId, {
          ...(q ? { q } : {}),
          ...(pageParam ? { cursor: pageParam } : {}),
        }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    }),
};
