import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateProjectFromEstimateInput } from '../schemas/estimate.schema';
import { createProjectFromEstimate } from '../api/estimates.api';
import { projectKeys } from '@/features/projects';

export function useCreateProjectFromEstimate(estimateId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateProjectFromEstimateInput) =>
      createProjectFromEstimate(estimateId, body),
    meta: { successKey: 'toast.created' },
    onSuccess: (project) => {
      void queryClient.invalidateQueries({
        queryKey: projectKeys.list(project.client_id),
      });
    },
  });
}
