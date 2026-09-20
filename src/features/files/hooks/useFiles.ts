import { useQuery } from '@tanstack/react-query';
import { filesQueries } from '../api/files.queries';

export function useFiles(projectId: string) {
  return useQuery(filesQueries.list(projectId));
}
