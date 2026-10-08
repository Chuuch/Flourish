import { useQuery } from '@tanstack/react-query';
import { invoiceQueries } from '../api/invoices.queries';

export function usePortalInvoice(invoiceId: string) {
  return useQuery(invoiceQueries.portalDetail(invoiceId));
}
