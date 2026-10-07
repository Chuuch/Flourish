import { useQuery } from '@tanstack/react-query';
import { projectsQueries } from '../api/projects.queries';

export function useProjects(clientId: string, q = '') {
  return useQuery(projectsQueries.list(clientId, q));
}
