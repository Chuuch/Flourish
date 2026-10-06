import { useQuery } from '@tanstack/react-query';
import { ticketQueries } from '../api/tickets.queries';

export function useOrgTickets() {
  return useQuery(ticketQueries.orgList());
}
