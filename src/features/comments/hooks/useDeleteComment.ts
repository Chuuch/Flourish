import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment } from '../api/comments.api';
import { commentKeys } from '../api/comments.queries';

export function useDeleteComment(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: commentKeys.lists(taskId),
      }),
  });
}
