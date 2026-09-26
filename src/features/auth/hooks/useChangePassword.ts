import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store';
import { changePassword } from '../api/auth.api';
import { changePortalPassword } from '@/features/portal/api/portal-auth.api';

export function useChangePassword() {
  const role = useAuthStore((state) => state.role);

  return useMutation({
    mutationFn: (input: Parameters<typeof changePassword>[0]) =>
      role === 'client' ? changePortalPassword(input) : changePassword(input),
  });
}
