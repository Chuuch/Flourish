import { useQuery } from '@tanstack/react-query';
import { filesQueries } from '../api/files.queries';

export function useFiles(projectId: string, q = '') {
  return useQuery(filesQueries.list(projectId, q));
}
