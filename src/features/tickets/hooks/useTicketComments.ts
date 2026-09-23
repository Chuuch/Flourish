import { useQuery } from '@tanstack/react-query';
import type { TicketCommentSource } from '../api/ticket-comments.api';
import { ticketCommentQueries } from '../api/ticket-comments.queries';

export function useTicketComments(ticketId: string, source: TicketCommentSource = 'portal') {
  return useQuery(ticketCommentQueries.list(ticketId, source));
}
