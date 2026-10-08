import { queryOptions } from '@tanstack/react-query';
import { fetchFiles } from './files.api';

export const fileKeys = {
  all: ['files'] as const,
  lists: (projectId: string) => [...fileKeys.all, 'list', projectId] as const,
  list: (projectId: string, q = '') => [...fileKeys.lists(projectId), { q }] as const,
};

export const filesQueries = {
  list: (projectId: string, q = '') =>
    queryOptions({
      queryKey: fileKeys.list(projectId, q),
      queryFn: () => fetchFiles(projectId, q),
    }),
};
