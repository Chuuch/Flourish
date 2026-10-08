import { useProjects } from './useProjects';

export function useProject(clientId: string, projectId: string) {
  const { data, isPending, isError, error, refetch } = useProjects(clientId);
  const project = data?.pages.flatMap((page) => page.items).find((item) => item.id === projectId);

  return { project, isPending, isError, error, refetch };
}
