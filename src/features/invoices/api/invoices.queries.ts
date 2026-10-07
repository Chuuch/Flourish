import { queryOptions } from '@tanstack/react-query';
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
    queryOptions({
      queryKey: invoiceKeys.listQuery(clientId, q),
      queryFn: () => fetchInvoices(clientId, q),
    }),
  detail: (invoiceId: string) =>
    queryOptions({
      queryKey: invoiceKeys.detail(invoiceId),
      queryFn: () => fetchInvoice(invoiceId),
    }),
  portalList: (q = '') =>
    queryOptions({
      queryKey: invoiceKeys.portalListQuery(q),
      queryFn: () => fetchPortalInvoices(q),
    }),
  portalDetail: (invoiceId: string) =>
    queryOptions({
      queryKey: invoiceKeys.portalDetail(invoiceId),
      queryFn: () => fetchPortalInvoice(invoiceId),
    }),
};
