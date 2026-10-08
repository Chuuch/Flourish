import { useInfiniteQuery } from '@tanstack/react-query';
import { ticketQueries } from '../api/tickets.queries';

export function useTickets(q = '') {
  return useInfiniteQuery(ticketQueries.portalList(q));
}
