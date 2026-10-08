import { useInfiniteQuery } from '@tanstack/react-query';
import { ticketQueries } from '../api/tickets.queries';

export function useStaffTickets(clientId: string, q = '') {
  return useInfiniteQuery(ticketQueries.staffList(clientId, q));
}
