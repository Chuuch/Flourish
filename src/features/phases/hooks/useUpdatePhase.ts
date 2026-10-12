import { useMutation, useQueryClient } from '@tanstack/react-query';
import { phaseKeys } from '../api/phases.queries';
import { updatePhase } from '../api/phases.api';
import { isVersionConflict } from '@/lib/api/versionConflict';
import type { UpdatePhaseInput } from '../schemas/phase.schema';

export function useUpdatePhase(projectId: string) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    void queryClient.invalidateQueries({ queryKey: phaseKeys.project(projectId) });

  return useMutation({
    mutationFn: ({ phaseId, input }: { phaseId: string; input: UpdatePhaseInput }) =>
      updatePhase(phaseId, input),
    meta: { successKey: 'toast.updated' },
    onSuccess: () => {
      invalidate();
    },
    onError: (error) => {
      if (isVersionConflict(error)) {
        invalidate();
      }
    },
  });
}
