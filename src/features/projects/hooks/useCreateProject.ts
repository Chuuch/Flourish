import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateProjectInput } from '../schemas/project.schema';
import { createProject } from '../api/projects.api';
import { projectKeys } from '../api/projects.queries';

export function useCreateProject(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProjectInput) => createProject(clientId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: projectKeys.lists(clientId),
      }),
  });
}
