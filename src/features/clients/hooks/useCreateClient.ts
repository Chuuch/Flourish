import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '../api/clients.api';
import { clientKeys } from '../api/clients.queries';

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClient,
    meta: { successKey: 'toast.created' },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: clientKeys.lists(),
      }),
  });
}
