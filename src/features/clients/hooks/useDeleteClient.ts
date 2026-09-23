import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteClient } from '../api/clients.api';
import { clientKeys } from '../api/clients.queries';

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clientId: string) => deleteClient(clientId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: clientKeys.lists(),
      }),
  });
}
