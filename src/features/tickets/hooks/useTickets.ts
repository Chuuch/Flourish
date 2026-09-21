import { useQuery } from '@tanstack/react-query';
import { ticketQueries } from '../api/tickets.queries';

export function useTickets() {
  return useQuery(ticketQueries.portalList());
}
