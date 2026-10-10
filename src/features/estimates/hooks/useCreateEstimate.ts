import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateEstimateBody } from '../schemas/estimate.schema';
import { createEstimate } from '../api/estimates.api';
import { estimateKeys } from '../api/estimates.queries';

export function useCreateEstimate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateEstimateBody) => createEstimate(body),
    meta: { successKey: 'toast.created' },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: estimateKeys.list() });
    },
  });
}
