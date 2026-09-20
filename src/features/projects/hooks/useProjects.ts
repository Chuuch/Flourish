import { useQuery } from '@tanstack/react-query';
import { projectsQueries } from '../api/projects.queries';

export function useProjects(clientId: string) {
  return useQuery(projectsQueries.list(clientId));
}
