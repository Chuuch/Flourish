import { useAuthStore } from '@/features/auth';
import { useMutation } from '@tanstack/react-query';
import { portalLogin } from '../api/portal-auth.api';

export function usePortalLogin() {
  const setPortalSession = useAuthStore((state) => state.setPortalSession);

  return useMutation({
    mutationFn: portalLogin,
    onSuccess: (data) => {
      setPortalSession(data.user, data.access_token, data.organization, data.client, data.role);
    },
  });
}
