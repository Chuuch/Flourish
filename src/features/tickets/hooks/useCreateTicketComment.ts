import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTicketComment, type TicketCommentSource } from '../api/ticket-comments.api';
import type { CreateTicketCommentInput } from '../schemas/ticket-comment.schema';
import { ticketCommentKeys } from '../api/ticket-comments.queries';

export function useCreateTicketComment(ticketId: string, source: TicketCommentSource = 'portal') {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTicketCommentInput) => createTicketComment(ticketId, input, source),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ticketCommentKeys.lists(ticketId, source),
      }),
  });
}
