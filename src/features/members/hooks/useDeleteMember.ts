import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMember } from '../api/members.api';
import { memberKeys } from '../api/members.queries';

export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteMember(userId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: memberKeys.lists(),
      }),
  });
}
