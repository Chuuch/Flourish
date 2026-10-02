import { useMutation } from '@tanstack/react-query';
import { downloadPortalInvoicePdf } from '../api/invoices.api';

export function useDownloadPortalInvoicePdf() {
  return useMutation({
    mutationFn: (invoiceId: string) => downloadPortalInvoicePdf(invoiceId),
    meta: { successKey: 'toast.downloaded' },
  });
}
