import { Alert } from '@/components/ui';
import { useFiles } from '../hooks/useFiles';

export function FileList({ projectId }: { projectId: string }) {
  const { data, isPending, isError, error, refetch } = useFiles(projectId);

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
