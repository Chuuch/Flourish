import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createInvoice } from '../api/invoices.api';
import { invoiceKeys } from '../api/invoices.queries';

export function useCreateInvoice(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ from, to }: { from: string; to: string }) => createInvoice(clientId, from, to),
    meta: { successKey: 'toast.created' },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: invoiceKeys.list(clientId),
      }),
  });
}
