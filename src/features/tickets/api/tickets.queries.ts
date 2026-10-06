import { queryOptions } from '@tanstack/react-query';
import { fetchOrgTickets, fetchPortalTickets, fetchStaffTickets } from './tickets.api';

export const ticketKeys = {
  all: ['tickets'] as const,
  portalList: () => [...ticketKeys.all, 'portal', 'list'] as const,
  staffList: (clientId: string) => [...ticketKeys.all, 'staff', 'list', clientId] as const,
  orgList: () => [...ticketKeys.all, 'org', 'list'] as const,
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
  orgList: () =>
    queryOptions({
      queryKey: ticketKeys.orgList(),
      queryFn: fetchOrgTickets,
    }),
};
