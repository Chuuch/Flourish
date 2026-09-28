import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMember } from '../api/members.api';
import { memberKeys } from '../api/members.queries';

export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteMember(userId),
    meta: { successKey: 'toast.deleted' },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: memberKeys.lists(),
      }),
  });
}
