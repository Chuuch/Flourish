import { useMutation } from '@tanstack/react-query';
import { acceptInvite } from '../api/auth.api';

export function useAcceptInvite() {
  return useMutation({
    mutationFn: acceptInvite,
  });
}
