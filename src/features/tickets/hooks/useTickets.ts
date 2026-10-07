import { useQuery } from '@tanstack/react-query';
import { ticketQueries } from '../api/tickets.queries';

export function useTickets(q = '') {
  return useQuery(ticketQueries.portalList(q));
}
