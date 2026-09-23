import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMember } from '../api/members.api';
import { memberKeys } from '../api/members.queries';
import type { UpdateMemberInput } from '../schemas/member.schema';

export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, input }: { userId: string; input: UpdateMemberInput }) =>
      updateMember(userId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: memberKeys.lists(),
      }),
  });
}
