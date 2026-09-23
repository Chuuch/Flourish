import { queryOptions } from '@tanstack/react-query';
import { fetchTicketComments, type TicketCommentSource } from './ticket-comments.api';
import { ticketKeys } from './tickets.queries';

export const ticketCommentKeys = {
  all: [...ticketKeys.all, 'comments'] as const,
  lists: (ticketId: string, source: TicketCommentSource = 'portal') =>
    [...ticketKeys.all, source, 'comments', ticketId] as const,
};

export const ticketCommentQueries = {
  list: (ticketId: string, source: TicketCommentSource = 'portal') =>
    queryOptions({
      queryKey: ticketCommentKeys.lists(ticketId, source),
      queryFn: () => fetchTicketComments(ticketId, source),
    }),
};
