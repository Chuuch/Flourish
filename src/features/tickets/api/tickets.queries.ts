import { queryOptions } from '@tanstack/react-query';
import { fetchPortalTickets } from './tickets.api';

export const ticketKeys = {
  all: ['tickets'] as const,
  portalList: () => [...ticketKeys.all, 'portal', 'list'] as const,
};

export const ticketQueries = {
  portalList: () =>
    queryOptions({
      queryKey: ticketKeys.portalList(),
      queryFn: fetchPortalTickets,
    }),
};
