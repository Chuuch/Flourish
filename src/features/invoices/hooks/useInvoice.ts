import { useQuery } from '@tanstack/react-query';
import { invoiceQueries } from '../api/invoices.queries';

export function useInvoice(invoiceId: string) {
  return useQuery(invoiceQueries.detail(invoiceId));
}
