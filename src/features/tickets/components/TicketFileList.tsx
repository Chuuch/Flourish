import { Alert, Button } from '@/components/ui';
import { useTicketFiles } from '../hooks/useTicketFiles';
import type { TicketFileSource } from '../api/ticket-files.api';
import { useAuthStore } from '@/features/auth';
import { useDeleteTicketFile } from '../hooks/useDeleteTicketFile';
import { canMutateTicketFile, ticketFileLabel } from '../schemas/ticket-file.schema';

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

  if (isPending) {
    return <p role="status">Loading attachments...</p>;
  }

  if (isError) {
    return (
      <Alert>
        <p>Could not load attachments: {error.message}</p>
        <button type="button" onClick={() => void refetch()}>
          Retry
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>No attachments yet.</p>;
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
