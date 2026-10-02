import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markInvoicePaid } from '../api/invoices.api';
import { invoiceKeys } from '../api/invoices.queries';

export function useMarkInvoicePaid(clientId: string, invoiceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markInvoicePaid(invoiceId),
    meta: { successKey: 'toast.markedPaid' },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.list(clientId) });
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(invoiceId) });
    },
  });
}
