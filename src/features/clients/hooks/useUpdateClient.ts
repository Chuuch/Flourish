import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateClient } from '../api/clients.api';
import { clientKeys } from '../api/clients.queries';
import type { UpdateClientInput } from '../schemas/client.schema';

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, input }: { clientId: string; input: UpdateClientInput }) =>
      updateClient(clientId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: clientKeys.lists(),
      }),
  });
}
