import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteInvoice } from '../api/invoices.api';
import { invoiceKeys } from '../api/invoices.queries';

export function useDeleteInvoice(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invoiceId: string) => deleteInvoice(invoiceId),
    meta: { successKey: 'toast.deleted' },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: invoiceKeys.list(clientId),
      }),
  });
}
