import { queryOptions } from '@tanstack/react-query';
import { ticketKeys } from './tickets.queries';
import { fetchPortalTicketFiles } from './ticket-files.api';

export const ticketFileKeys = {
  all: [...ticketKeys.all, 'files'] as const,
  lists: (ticketId: string) => [...ticketKeys.all, 'list', ticketId] as const,
};

export const ticketFileQueries = {
  list: (ticketId: string) =>
    queryOptions({
      queryKey: ticketFileKeys.lists(ticketId),
      queryFn: () => fetchPortalTicketFiles(ticketId),
    }),
};
