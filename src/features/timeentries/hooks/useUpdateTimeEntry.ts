import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTimeEntry } from '../api/time-entries.api';
import { timeEntryKeys } from '../api/time-entries.queries';
import type { UpdateTimeEntryInput } from '../schemas/time-entry.schema';

export function useUpdateTimeEntry(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ entryId, input }: { entryId: string; input: UpdateTimeEntryInput }) =>
      updateTimeEntry(entryId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: timeEntryKeys.lists(taskId),
      }),
  });
}
