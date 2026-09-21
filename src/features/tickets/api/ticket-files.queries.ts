import { queryOptions } from '@tanstack/react-query';
import { ticketKeys } from './tickets.queries';
import { fetchTicketFiles, type TicketFileSource } from './ticket-files.api';

export const ticketFileKeys = {
  all: [...ticketKeys.all, 'files'] as const,
  lists: (ticketId: string, source: TicketFileSource = 'portal') =>
    [...ticketKeys.all, source, 'list', ticketId] as const,
};

export const ticketFileQueries = {
  list: (ticketId: string, source: TicketFileSource = 'portal') =>
    queryOptions({
      queryKey: ticketFileKeys.lists(ticketId, source),
      queryFn: () => fetchTicketFiles(ticketId, source),
    }),
};
