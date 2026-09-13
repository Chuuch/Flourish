import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store';
import { login } from '../api/auth.api';

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setSession(data.user, data.access_token, data.organization, data.role);
    },
  });
}
