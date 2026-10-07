import { queryOptions } from '@tanstack/react-query';
import { fetchProjects } from './projects.api';

export const projectKeys = {
  all: ['projects'] as const,
  lists: (clientId: string) => [...projectKeys.all, 'list', clientId] as const,
  list: (clientId: string, q = '') => [...projectKeys.lists(clientId), { q }] as const,
};

export const projectsQueries = {
  list: (clientId: string, q = '') =>
    queryOptions({
      queryKey: projectKeys.list(clientId, q),
      queryFn: () => fetchProjects(clientId, q),
    }),
};
