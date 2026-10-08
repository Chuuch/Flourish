import { useInfiniteQuery } from '@tanstack/react-query';
import { invoiceQueries } from '../api/invoices.queries';

export function useInvoices(clientId: string, q = '') {
  return useInfiniteQuery(invoiceQueries.list(clientId, q));
}
