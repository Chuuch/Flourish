import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTicket } from '../api/tickets.api';
import { ticketKeys } from '../api/tickets.queries';

export function useDeleteTicket(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ticketId: string) => deleteTicket(ticketId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ticketKeys.staffList(clientId),
      }),
  });
}
