import { queryOptions } from '@tanstack/react-query';
import { fetchInvoice, fetchInvoices } from './invoices.api';

export const invoiceKeys = {
  all: ['invoices'] as const,
  list: (clientId: string) => [...invoiceKeys.all, 'list', clientId] as const,
  detail: (invoiceId: string) => [...invoiceKeys.all, 'detail', invoiceId] as const,
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
};
