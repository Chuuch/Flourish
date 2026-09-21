import { queryOptions } from '@tanstack/react-query';
import { fetchPortalTickets, fetchStaffTickets } from './tickets.api';

export const ticketKeys = {
  all: ['tickets'] as const,
  portalList: () => [...ticketKeys.all, 'portal', 'list'] as const,
  staffList: (clientId: string) => [...ticketKeys.all, 'staff', 'list', clientId] as const,
};

export const ticketQueries = {
  portalList: () =>
    queryOptions({
      queryKey: ticketKeys.portalList(),
      queryFn: fetchPortalTickets,
    }),
  staffList: (clientId: string) =>
    queryOptions({
      queryKey: ticketKeys.staffList(clientId),
      queryFn: () => fetchStaffTickets(clientId),
    }),
};
