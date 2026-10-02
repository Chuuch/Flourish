import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateInvoice } from '../api/invoices.api';
import { invoiceKeys } from '../api/invoices.queries';

export function useUpdateInvoice(clientId: string, invoiceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ from, to }: { from: string; to: string }) => updateInvoice(invoiceId, from, to),
    meta: { successKey: 'toast.updated' },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.list(clientId) });
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(invoiceId) });
    },
  });
}
