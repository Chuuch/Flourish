import { useQuery } from '@tanstack/react-query';
import { invoiceQueries } from '../api/invoices.queries';

export function usePortalInvoices() {
  return useQuery(invoiceQueries.portalList());
}
