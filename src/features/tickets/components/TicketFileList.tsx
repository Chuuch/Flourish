import { Alert } from '@/components/ui';
import { useTicketFiles } from '../hooks/useTicketFiles';
import type { TicketFileSource } from '../api/ticket-files.api';

export function TicketFileList({
  ticketId,
  source = 'portal',
}: {
  ticketId: string;
  source?: TicketFileSource;
}) {
  const { data, isPending, isError, error, refetch } = useTicketFiles(ticketId, source);

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
    <ul>
      {data.map((file) => {
        const label = `${file.filename} (${String(file.size)} bytes)`;

        return (
          <li key={file.id}>
            {file.download_url ? <a href={file.download_url}>{label}</a> : label}
          </li>
        );
      })}
    </ul>
  );
}
