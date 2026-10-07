import { useQuery } from '@tanstack/react-query';
import { invoiceQueries } from '../api/invoices.queries';

export function useInvoices(clientId: string, q = '') {
  return useQuery(invoiceQueries.list(clientId, q));
}
