import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadProjectFile } from '../api/files.api';
import { fileKeys } from '../api/files.queries';

export function useUploadFIle(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadProjectFile(projectId, file),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: fileKeys.lists(projectId),
      }),
  });
}
