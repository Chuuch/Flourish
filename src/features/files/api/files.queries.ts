import { queryOptions } from '@tanstack/react-query';
import { fetchFiles } from './files.api';

export const fileKeys = {
  all: ['files'] as const,
  lists: (projectId: string) => [...fileKeys.all, 'list', projectId] as const,
};

export const filesQueries = {
  list: (projectId: string) =>
    queryOptions({
      queryKey: fileKeys.lists(projectId),
      queryFn: () => fetchFiles(projectId),
    }),
};
