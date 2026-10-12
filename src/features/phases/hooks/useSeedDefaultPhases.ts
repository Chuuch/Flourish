import { useMutation, useQueryClient } from '@tanstack/react-query';
import { phaseKeys } from '../api/phases.queries';
import { seedDefaultPhases } from '../api/phases.api';

export function useSeedDefaultPhases(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => seedDefaultPhases(projectId),
    meta: { successKey: 'toast.updated' },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: phaseKeys.project(projectId) });
    },
  });
}
