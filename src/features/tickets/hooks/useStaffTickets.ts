import { useQuery } from '@tanstack/react-query';
import { ticketQueries } from '../api/tickets.queries';

export function useStaffTickets(clientId: string) {
  return useQuery(ticketQueries.staffList(clientId));
}
