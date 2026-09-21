import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateTicketInput } from '../schemas/ticket.schema';
import { createPortalTicket } from '../api/tickets.api';
import { ticketKeys } from '../api/tickets.queries';

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTicketInput) => createPortalTicket(input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ticketKeys.portalList(),
      }),
  });
}
