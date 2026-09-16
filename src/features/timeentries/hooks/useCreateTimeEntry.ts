import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateTimeEntryInput } from '../schemas/time-entry.schema';
import { createTimeEntry } from '../api/time-entries.api';
import { timeEntryKeys } from '../api/time-entries.queries';

export function useCreateTimeEntry(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTimeEntryInput) => createTimeEntry(taskId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: timeEntryKeys.lists(taskId),
      }),
  });
}
