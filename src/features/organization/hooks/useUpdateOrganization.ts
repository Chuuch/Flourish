import { useMutation } from '@tanstack/react-query';
import { updateOrganization } from '../api/organization.api';
import { useAuthStore } from '@/features/auth';
import type { UpdateOrganizationInput } from '@/features/auth/schemas/auth.schema';

export function useUpdateOrganization() {
  const setSessionOrganization = useAuthStore((state) => state.setSessionOrganization);

  return useMutation({
    mutationFn: (input: UpdateOrganizationInput) => updateOrganization(input),
    meta: { successKey: 'toast.updated' },
    onSuccess: (organization) => {
      setSessionOrganization(organization);
    },
  });
}
