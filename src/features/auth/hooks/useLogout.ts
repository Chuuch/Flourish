import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store';
import { logout } from '../api/auth.api';
import { authKeys } from '../api/auth.queries';

export function useLogout() {
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((state) => state.clearSession);

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearSession();
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
}
