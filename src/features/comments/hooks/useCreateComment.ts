import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateCommentInput } from '../schemas/comment.schema';
import { createComment } from '../api/comments.api';
import { commentKeys } from '../api/comments.queries';

export function useCreateComment(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCommentInput) => createComment(taskId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: commentKeys.lists(taskId),
      }),
  });
}
