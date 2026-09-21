import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadTicketFile, type TicketFileSource } from '../api/ticket-files.api';
import { ticketFileKeys } from '../api/ticket-files.queries';

export function useUploadTicketFile(ticketId: string, source: TicketFileSource = 'portal') {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadTicketFile(ticketId, file, source),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ticketFileKeys.lists(ticketId, source),
      }),
  });
}
