import { clientProjectsPath, paths } from '@/app/router/paths';
import { Link, useParams } from 'react-router';
import { CreateFileForm } from '../components/CreateFileForm';
import { FileList } from '../components/FileList';

export function FilesPage() {
  const { clientId, projectId } = useParams();

  if (!clientId || !projectId) {
    return (
      <main>
        <h1>Files</h1>
        <p>Project not found.</p>
      </main>
    );
  }

  return (
    <main>
      <p>
        <Link to={paths.clients}>Clients</Link>
        {' / '}
        <Link to={clientProjectsPath(clientId)}>Projects</Link>
      </p>
      <h1>Files</h1>
      <CreateFileForm projectId={projectId} />
      <FileList projectId={projectId} />
    </main>
  );
}
