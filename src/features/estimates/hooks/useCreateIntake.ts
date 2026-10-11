import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateIntakeBody } from '../schemas/intake.schema';
import { estimateKeys } from '../api/estimates.queries';
import { createIntake } from '../api/estimates.api';

export function useCreateIntake() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateIntakeBody) => createIntake(body),
    meta: { successKey: 'toast.sent' },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: estimateKeys.intakes() });
    },
  });
}
