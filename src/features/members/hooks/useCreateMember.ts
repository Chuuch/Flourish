import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMember } from '../api/members.api';
import { memberKeys } from '../api/members.queries';

export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMember,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: memberKeys.lists(),
      }),
  });
}
