import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProject } from '../api/projects.api';
import { projectKeys } from '../api/projects.queries';

export function useDeleteProject(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: projectKeys.lists(clientId),
      }),
  });
}
