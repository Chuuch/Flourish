import { useQuery } from '@tanstack/react-query';
import { ticketFileQueries } from '../api/ticket-files.queries';
import type { TicketFileSource } from '../api/ticket-files.api';

export function useTicketFiles(ticketId: string, source: TicketFileSource = 'portal') {
  return useQuery(ticketFileQueries.list(ticketId, source));
}
