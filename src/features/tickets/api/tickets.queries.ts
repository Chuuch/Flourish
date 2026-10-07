import { queryOptions } from '@tanstack/react-query';
import { fetchPortalTickets, fetchStaffTickets } from './tickets.api';

export const ticketKeys = {
  all: ['tickets'] as const,
  portalList: () => [...ticketKeys.all, 'portal', 'list'] as const,
  portal: (q = '') => [...ticketKeys.portalList(), { q }] as const,
  staffList: (clientId: string) => [...ticketKeys.all, 'staff', 'list', clientId] as const,
  staff: (clientId: string, q = '') => [...ticketKeys.staffList(clientId), { q }] as const,
};

export const ticketQueries = {
  portalList: (q = '') =>
    queryOptions({
      queryKey: ticketKeys.portal(q),
      queryFn: () => fetchPortalTickets(q),
    }),
  staffList: (clientId: string, q = '') =>
    queryOptions({
      queryKey: ticketKeys.staff(clientId, q),
      queryFn: () => fetchStaffTickets(clientId, q),
    }),
};
