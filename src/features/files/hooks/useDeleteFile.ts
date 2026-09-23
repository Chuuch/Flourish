import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFile } from '../api/files.api';
import { fileKeys } from '../api/files.queries';

export function useDeleteFile(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: string) => deleteFile(fileId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: fileKeys.lists(projectId),
      }),
  });
}
