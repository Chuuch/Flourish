import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadPortalTicketFile } from '../api/ticket-files.api';
import { ticketFileKeys } from '../api/ticket-files.queries';

export function useUploadTicketFile(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadPortalTicketFile(ticketId, file),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ticketFileKeys.lists(ticketId),
      }),
  });
}
