import { Alert, Button } from '@/components/ui';
import { useTicketFiles } from '../hooks/useTicketFiles';
import type { TicketFileSource } from '../api/ticket-files.api';
import { useAuthStore } from '@/features/auth';
import { useDeleteTicketFile } from '../hooks/useDeleteTicketFile';
import { canMutateTicketFile, ticketFileLabel } from '../schemas/ticket-file.schema';
import { useI18n } from '@/features/i18n';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';

export function TicketFileList({
  ticketId,
  source = 'portal',
}: {
  ticketId: string;
  source?: TicketFileSource;
}) {
  const role = useAuthStore((state) => state.role);
  const actorUserId = useAuthStore((state) => state.user?.id);
  const { data, isPending, isError, error, refetch } = useTicketFiles(ticketId, source);
  const deleteTicketFile = useDeleteTicketFile(ticketId, source);
  const { t } = useI18n();

  if (isPending) {
    return <ListSkeleton label={t('tickets.attachmentsLoading')} />;
  }

  if (isError) {
    return (
      <Alert>
        <p>{t('tickets.attachmentsLoadError', { message: error.message })}</p>
        <button type="button" onClick={() => void refetch()}>
          {t('common.retry')}
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>{t('tickets.attachmentsEmpty')}</p>;
  }

  return (
    <>
      {deleteTicketFile.isError ? <Alert>{deleteTicketFile.error.message}</Alert> : null}
      <ul>
        {data.map((file) => {
          const label = ticketFileLabel(file);

          return (
            <li key={file.id}>
              {file.download_url ? <a href={file.download_url}>{label}</a> : label}
              {canMutateTicketFile(role, actorUserId, file.uploaded_by) ? (
                <Button
                  type="button"
                  disabled={deleteTicketFile.isPending}
                  onClick={() => {
                    deleteTicketFile.mutate(file.id);
                  }}
                >
                  {t('tickets.removeLabel', { label })}
                </Button>
              ) : null}
            </li>
          );
        })}
      </ul>
    </>
  );
}
