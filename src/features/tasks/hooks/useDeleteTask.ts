import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask } from '../api/tasks.api';
import { taskKeys } from '../api/tasks.queries';

export function useDeleteTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.lists(projectId) });
      void queryClient.invalidateQueries({ queryKey: taskKeys.inbox() });
    },
  });
}
