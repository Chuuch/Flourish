import { infiniteQueryOptions } from '@tanstack/react-query';
import { fetchPortalProjects, fetchProjects } from './projects.api';

export const projectKeys = {
  all: ['projects'] as const,
  lists: (clientId: string) => [...projectKeys.all, 'list', clientId] as const,
  list: (clientId: string, q = '') => [...projectKeys.lists(clientId), { q }] as const,
  portalLists: () => [...projectKeys.all, 'portal'] as const,
  portalList: (q = '') => [...projectKeys.portalLists(), { q }] as const,
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

export const portalProjectsQueries = {
  list: (q = '') =>
    infiniteQueryOptions({
      queryKey: projectKeys.portalList(q),
      queryFn: ({ pageParam }) =>
        fetchPortalProjects({
          ...(q ? { q } : {}),
          ...(pageParam ? { cursor: pageParam } : {}),
        }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    }),
};
