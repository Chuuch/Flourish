import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProject } from '../api/projects.api';
import { projectKeys } from '../api/projects.queries';
import type { UpdateProjectInput } from '../schemas/project.schema';

export function useUpdateProject(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, input }: { projectId: string; input: UpdateProjectInput }) =>
      updateProject(projectId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: projectKeys.lists(clientId),
      }),
  });
}
