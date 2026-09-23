import { Alert, Button } from '@/components/ui';
import { useFiles } from '../hooks/useFiles';
import { useAuthStore } from '@/features/auth';
import { useDeleteFile } from '../hooks/useDeleteFile';
import { canMutateFile, fileLabel } from '../schemas/file.schema';

export function FileList({ projectId }: { projectId: string }) {
  const role = useAuthStore((state) => state.role);
  const actorUserId = useAuthStore((state) => state.user?.id);
  const { data, isPending, isError, error, refetch } = useFiles(projectId);
  const deleteFile = useDeleteFile(projectId);

  if (isPending) {
    return <p role="status">Loading files...</p>;
  }

  if (isError) {
    return (
      <Alert>
        <p>Could not load files: {error.message}</p>
        <button type="button" onClick={() => void refetch()}>
          Retry
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>No files yet.</p>;
  }

  return (
    <>
      {deleteFile.isError ? <Alert>{deleteFile.error.message}</Alert> : null}
      <ul>
        {data.map((file) => {
          const label = fileLabel(file);

          return (
            <li key={file.id}>
              {file.download_url ? <a href={file.download_url}>{label}</a> : label}
              {canMutateFile(role, actorUserId, file.uploaded_by) ? (
                <Button
                  type="button"
                  disabled={deleteFile.isPending}
                  onClick={() => {
                    deleteFile.mutate(file.id);
                  }}
                >
                  {`Remove ${label}`}
                </Button>
              ) : null}
            </li>
          );
        })}
      </ul>
    </>
  );
}
