import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateTaskInput } from '../schemas/task.schema';
import { createTask } from '../api/tasks.api';
import { taskKeys } from '../api/tasks.queries';

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(projectId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: taskKeys.lists(projectId),
      }),
  });
}
