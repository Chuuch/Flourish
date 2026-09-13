import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store';
import { register } from '../api/auth.api';

export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setSession(data.user, data.access_token, data.organization, data.role);
    },
  });
}
