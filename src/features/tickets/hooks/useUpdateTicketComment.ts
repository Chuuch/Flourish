import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTicketComment, type TicketCommentSource } from '../api/ticket-comments.api';
import { ticketCommentKeys } from '../api/ticket-comments.queries';
import type { UpdateTicketCommentInput } from '../schemas/ticket-comment.schema';

export function useUpdateTicketComment(ticketId: string, source: TicketCommentSource = 'portal') {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, input }: { commentId: string; input: UpdateTicketCommentInput }) =>
      updateTicketComment(commentId, input, source),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ticketCommentKeys.lists(ticketId, source),
      }),
  });
}
