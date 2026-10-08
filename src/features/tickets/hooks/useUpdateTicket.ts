import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTicket } from '../api/tickets.api';
import { ticketKeys } from '../api/tickets.queries';
import type { UpdateTicketInput } from '../schemas/ticket.schema';
import { isVersionConflict } from '@/lib/api/versionConflict';

export function useUpdateTicket(clientId: string) {
  const queryClient = useQueryClient();

  const invalidateTicketList = () =>
    void queryClient.invalidateQueries({
      queryKey: ticketKeys.staffList(clientId),
    });

  return useMutation({
    mutationFn: ({ ticketId, input }: { ticketId: string; input: UpdateTicketInput }) =>
      updateTicket(ticketId, input),
    meta: { successKey: 'toast.updated' },
    onSuccess: () => {
      invalidateTicketList();
    },
    onError: (error) => {
      if (isVersionConflict(error)) {
        invalidateTicketList();
      }
    },
  });
}
