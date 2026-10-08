import { useInfiniteQuery } from '@tanstack/react-query';
import { invoiceQueries } from '../api/invoices.queries';

export function usePortalInvoices(q = '') {
  return useInfiniteQuery(invoiceQueries.portalList(q));
}
