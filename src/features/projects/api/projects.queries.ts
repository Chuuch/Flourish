import { queryOptions } from '@tanstack/react-query';
import { fetchProjects } from './projects.api';

export const projectKeys = {
  all: ['projects'] as const,
  lists: (clientId: string) => [...projectKeys.all, 'list', clientId] as const,
};

export const projectsQueries = {
  list: (clientId: string) =>
    queryOptions({
      queryKey: projectKeys.lists(clientId),
      queryFn: () => fetchProjects(clientId),
    }),
};
