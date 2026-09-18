import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateCommentInput } from '../schemas/comment.schema';
import { updateComment } from '../api/comments.api';
import { commentKeys } from '../api/comments.queries';

export function useUpdateComment(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, input }: { commentId: string; input: UpdateCommentInput }) =>
      updateComment(commentId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: commentKeys.lists(taskId),
      }),
  });
}
