import { useQuery } from '@tanstack/react-query';
import { invoiceQueries } from '../api/invoices.queries';

export function usePortalInvoices(q = '') {
  return useQuery(invoiceQueries.portalList(q));
}
