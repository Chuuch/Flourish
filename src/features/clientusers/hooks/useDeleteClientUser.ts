import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteClientUser } from '../api/client-users.api';
import { clientUserKeys } from '../api/client-users.queries';

export function useDeleteClientUser(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteClientUser(clientId, userId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: clientUserKeys.lists(clientId),
      }),
  });
}
