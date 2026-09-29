import { useProjects } from './useProjects';

export function useProject(clientId: string, projectId: string) {
  const { data, isPending, isError, error, refetch } = useProjects(clientId);
  const project = data?.find((item) => item.id === projectId);

  return { project, isPending, isError, error, refetch };
}
