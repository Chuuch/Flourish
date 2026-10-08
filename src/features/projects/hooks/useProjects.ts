import { useInfiniteQuery } from '@tanstack/react-query';
import { projectsQueries } from '../api/projects.queries';

export function useProjects(clientId: string, q = '') {
  return useInfiniteQuery(projectsQueries.list(clientId, q));
}
