import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTimeEntry } from '../api/time-entries.api';
import { timeEntryKeys } from '../api/time-entries.queries';

export function useDeleteTimeEntry(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entryId: string) => deleteTimeEntry(entryId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: timeEntryKeys.lists(taskId),
      }),
  });
}
