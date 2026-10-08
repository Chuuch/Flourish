import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateTaskInput } from '../schemas/task.schema';
import { updateTask } from '../api/tasks.api';
import { taskKeys } from '../api/tasks.queries';
import { isVersionConflict } from '@/lib/api/versionConflict';

export function useUpdateTask(projectId?: string) {
  const queryClient = useQueryClient();

  const invalidateTaskLists = () => {
    if (projectId) {
      void queryClient.invalidateQueries({ queryKey: taskKeys.lists(projectId) });
    }
    void queryClient.invalidateQueries({ queryKey: taskKeys.inbox() });
  };

  return useMutation({
    mutationFn: ({ taskId, input }: { taskId: string; input: UpdateTaskInput }) =>
      updateTask(taskId, input),
    meta: { successKey: 'toast.updated' },
    onSuccess: () => {
      invalidateTaskLists();
    },
    onError: (error) => {
      if (isVersionConflict(error)) {
        invalidateTaskLists();
      }
    },
  });
}
