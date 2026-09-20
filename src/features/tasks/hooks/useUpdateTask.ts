import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateTaskInput } from '../schemas/task.schema';
import { updateTask } from '../api/tasks.api';
import { taskKeys } from '../api/tasks.queries';

export function useUpdateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, input }: { taskId: string; input: UpdateTaskInput }) =>
      updateTask(taskId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: taskKeys.lists(projectId),
      }),
  });
}
