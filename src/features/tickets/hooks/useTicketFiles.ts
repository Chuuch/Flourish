import { useQuery } from '@tanstack/react-query';
import { ticketFileQueries } from '../api/ticket-files.queries';

export function useTicketFiles(ticketId: string) {
  return useQuery(ticketFileQueries.list(ticketId));
}
