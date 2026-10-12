import { useMutation, useQueryClient } from '@tanstack/react-query';
import { convertTicket } from '../api/tickets.api';
import { ticketKeys } from '../api/tickets.queries';
import { taskKeys } from '@/features/tasks';
import type { ConverTicketInput } from '../schemas/ticket.schema';

export function useConvertTicket(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, input }: { ticketId: string; input: ConverTicketInput }) =>
      convertTicket(ticketId, input),
    meta: { successKey: 'toast.converted' },
    onSuccess: (_task, { input }) => {
      void queryClient.invalidateQueries({
        queryKey: ticketKeys.staffList(clientId),
      });
      void queryClient.invalidateQueries({
        queryKey: taskKeys.lists(input.project_id),
      });
    },
  });
}
