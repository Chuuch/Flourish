import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateClientUserInput } from '../schemas/client-user.schema';
import { createClientUser } from '../api/client-users.api';
import { clientUserKeys } from '../api/client-users.queries';

export function useCreateClientUser(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateClientUserInput) => createClientUser(clientId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: clientUserKeys.lists(clientId),
      }),
  });
}
