import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import {
  fetchInvoice,
  fetchInvoices,
  fetchPortalInvoice,
  fetchPortalInvoices,
} from './invoices.api';

export const invoiceKeys = {
  all: ['invoices'] as const,
  list: (clientId: string) => [...invoiceKeys.all, 'list', clientId] as const,
  listQuery: (clientId: string, q = '') => [...invoiceKeys.list(clientId), { q }] as const,
  detail: (invoiceId: string) => [...invoiceKeys.all, 'detail', invoiceId] as const,
  portalList: () => [...invoiceKeys.all, 'portal', 'list'] as const,
  portalListQuery: (q = '') => [...invoiceKeys.portalList(), { q }] as const,
  portalDetail: (invoiceId: string) => [...invoiceKeys.all, 'portal', 'detail', invoiceId] as const,
};

export const invoiceQueries = {
  list: (clientId: string, q = '') =>
    infiniteQueryOptions({
      queryKey: invoiceKeys.listQuery(clientId, q),
      queryFn: ({ pageParam }) =>
        fetchInvoices(clientId, {
          ...(q ? { q } : {}),
          ...(pageParam ? { cursor: pageParam } : {}),
        }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    }),
  detail: (invoiceId: string) =>
    queryOptions({
      queryKey: invoiceKeys.detail(invoiceId),
      queryFn: () => fetchInvoice(invoiceId),
    }),
  portalList: (q = '') =>
    infiniteQueryOptions({
      queryKey: invoiceKeys.portalListQuery(q),
      queryFn: ({ pageParam }) =>
        fetchPortalInvoices({
          ...(q ? { q } : {}),
          ...(pageParam ? { cursor: pageParam } : {}),
        }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    }),
  portalDetail: (invoiceId: string) =>
    queryOptions({
      queryKey: invoiceKeys.portalDetail(invoiceId),
      queryFn: () => fetchPortalInvoice(invoiceId),
    }),
};
