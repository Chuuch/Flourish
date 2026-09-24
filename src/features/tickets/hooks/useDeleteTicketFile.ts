import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTicketFile, type TicketFileSource } from '../api/ticket-files.api';
import { ticketFileKeys } from '../api/ticket-files.queries';

export function useDeleteTicketFile(ticketId: string, source: TicketFileSource = 'portal') {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: string) => deleteTicketFile(fileId, source),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ticketFileKeys.lists(ticketId, source),
      }),
  });
}
