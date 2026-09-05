import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userKeys } from '../api/users.queries';
import { createUser } from '../api/users.api';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      }),
  });
}
