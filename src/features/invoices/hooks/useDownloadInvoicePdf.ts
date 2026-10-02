import { useMutation } from '@tanstack/react-query';
import { downloadInvoicePdf } from '../api/invoices.api';

export function useDownloadInvoicePdf() {
  return useMutation({
    mutationFn: (invoiceId: string) => downloadInvoicePdf(invoiceId),
    meta: { successKey: 'toast.downloaded' },
  });
}
