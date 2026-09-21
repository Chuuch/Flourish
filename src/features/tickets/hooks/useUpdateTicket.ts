import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTicket } from '../api/tickets.api';
import { ticketKeys } from '../api/tickets.queries';
import type { UpdateTicketInput } from '../schemas/ticket.schema';

export function useUpdateTicket(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, input }: { ticketId: string; input: UpdateTicketInput }) =>
      updateTicket(ticketId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ticketKeys.staffList(clientId),
      }),
  });
}
