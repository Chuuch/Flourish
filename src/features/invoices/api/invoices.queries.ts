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
  detail: (invoiceId: string) => [...invoiceKeys.all, 'detail', invoiceId] as const,
  portalList: () => [...invoiceKeys.all, 'portal', 'list'] as const,
  portalDetail: (invoiceId: string) => [...invoiceKeys.all, 'portal', 'detail', invoiceId] as const,
};

export const invoiceQueries = {
  list: (clientId: string) =>
    queryOptions({
      queryKey: invoiceKeys.list(clientId),
      queryFn: () => fetchInvoices(clientId),
    }),
  detail: (invoiceId: string) =>
    queryOptions({
      queryKey: invoiceKeys.detail(invoiceId),
      queryFn: () => fetchInvoice(invoiceId),
    }),
  portalList: () =>
    queryOptions({
      queryKey: invoiceKeys.portalList(),
      queryFn: fetchPortalInvoices,
    }),
  portalDetail: (invoiceId: string) =>
    queryOptions({
      queryKey: invoiceKeys.portalDetail(invoiceId),
      queryFn: () => fetchPortalInvoice(invoiceId),
    }),
};
