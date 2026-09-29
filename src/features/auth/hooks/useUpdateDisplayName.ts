import { useMutation } from '@tanstack/react-query';
import { updateDisplayName } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import type { UpdateDisplayNameInput } from '../schemas/auth.schema';

export function useUpdateDisplayName() {
  const setSessionUser = useAuthStore((state) => state.setSessionUser);

  return useMutation({
    mutationFn: (input: UpdateDisplayNameInput) => updateDisplayName(input),
    meta: { successKey: 'toast.updated' },
    onSuccess: (user) => {
      setSessionUser(user);
    },
  });
}
