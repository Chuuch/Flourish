import { infiniteQueryOptions } from '@tanstack/react-query';
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
    infiniteQueryOptions({
      queryKey: ticketKeys.portal(q),
      queryFn: ({ pageParam }) =>
        fetchPortalTickets({
          ...(q ? { q } : {}),
          ...(pageParam ? { cursor: pageParam } : {}),
        }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    }),
  staffList: (clientId: string, q = '') =>
    infiniteQueryOptions({
      queryKey: ticketKeys.staff(clientId, q),
      queryFn: ({ pageParam }) =>
        fetchStaffTickets(clientId, {
          ...(q ? { q } : {}),
          ...(pageParam ? { cursor: pageParam } : {}),
        }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    }),
};
