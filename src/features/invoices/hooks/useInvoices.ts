import { useQuery } from '@tanstack/react-query';
import { invoiceQueries } from '../api/invoices.queries';

export function useInvoices(clientId: string) {
  return useQuery(invoiceQueries.list(clientId));
}
