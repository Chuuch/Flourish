import { useMutation } from '@tanstack/react-query';
import type { SubmitIntakeBody } from '../schemas/intake.schema';
import { submitPublicIntake } from '../api/estimates.api';

export function useSubmitIntake(token: string) {
  return useMutation({
    mutationFn: (body: SubmitIntakeBody) => submitPublicIntake(token, body),
  });
}
