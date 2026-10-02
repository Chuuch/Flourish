import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendInvoice } from '../api/invoices.api';
import { invoiceKeys } from '../api/invoices.queries';

export function useSendInvoice(clientId: string, invoiceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => sendInvoice(invoiceId),
    meta: { successKey: 'toast.sent' },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.list(clientId) });
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(invoiceId) });
    },
  });
}
