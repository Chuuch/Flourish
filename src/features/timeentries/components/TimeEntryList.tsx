import { Alert } from '@/components/ui';
import { useTimeEntries } from '../hooks/useTimeEntries';

export function TimeEntryList({ taskId }: { taskId: string }) {
  const { data, isPending, isError, error, refetch } = useTimeEntries(taskId);

  if (isPending) {
    return <p role="status">Loading time entries...</p>;
  }

  if (isError) {
    return (
      <Alert>
        <p>Could not load time entries: {error.message}</p>
        <button type="button" onClick={() => void refetch()}>
          Retry
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>No time entries yet.</p>;
  }

  return (
    <ul>
      {data.map((entry) => {
        const label = `${String(entry.minutes)} min`;
        return <li key={entry.id}>{entry.notes ? `${label} - ${entry.notes}` : label}</li>;
      })}
    </ul>
  );
}
