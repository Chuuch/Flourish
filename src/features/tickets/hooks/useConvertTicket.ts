import { useMutation, useQueryClient } from '@tanstack/react-query';
import { convertTicket } from '../api/tickets.api';
import { ticketKeys } from '../api/tickets.queries';
import { taskKeys } from '@/features/tasks';

export function useConvertTicket(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, projectId }: { ticketId: string; projectId: string }) =>
      convertTicket(ticketId, { project_id: projectId }),
    onSuccess: (_task, { projectId }) => {
      void queryClient.invalidateQueries({
        queryKey: ticketKeys.staffList(clientId),
      });
      void queryClient.invalidateQueries({
        queryKey: taskKeys.lists(projectId),
      });
    },
  });
}
