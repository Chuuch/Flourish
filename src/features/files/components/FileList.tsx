import { Alert, Button } from '@/components/ui';
import { useFiles } from '../hooks/useFiles';
import { useAuthStore } from '@/features/auth';
import { useDeleteFile } from '../hooks/useDeleteFile';
import { canMutateFile, fileLabel } from '../schemas/file.schema';
import { useI18n } from '@/features/i18n';

export function FileList({ projectId }: { projectId: string }) {
  const role = useAuthStore((state) => state.role);
  const actorUserId = useAuthStore((state) => state.user?.id);
  const { data, isPending, isError, error, refetch } = useFiles(projectId);
  const deleteFile = useDeleteFile(projectId);
  const { t } = useI18n();

  if (isPending) {
    return <p role="status">{t('files.loading')}</p>;
  }

  if (isError) {
    return (
      <Alert>
        <p>{t('files.loadError', { message: error.message })}</p>
        <button type="button" onClick={() => void refetch()}>
          {t('common.retry')}
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>{t('files.empty')}</p>;
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
                  {t('files.remove', { label })}
                </Button>
              ) : null}
            </li>
          );
        })}
      </ul>
    </>
  );
}
