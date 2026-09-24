import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTicketComment, type TicketCommentSource } from '../api/ticket-comments.api';
import { ticketCommentKeys } from '../api/ticket-comments.queries';

export function useDeleteTicketComment(ticketId: string, source: TicketCommentSource = 'portal') {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteTicketComment(commentId, source),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ticketCommentKeys.lists(ticketId, source),
      }),
  });
}
