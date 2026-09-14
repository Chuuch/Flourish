import { paths } from '@/app/router/paths';
import { Link, useParams } from 'react-router';
import { CreateProjectForm } from '../components/CreateProjectForm';
import { ProjectList } from '../components/ProjectList';

export function ProjectsPage() {
  const { clientId } = useParams();

  if (!clientId) {
    return (
      <main>
        <h1>Projects</h1>
        <p>Client not found.</p>
      </main>
    );
  }

  return (
    <main>
      <p>
        <Link to={paths.clients}>Clients</Link>
      </p>
      <h1>Projects</h1>
      <CreateProjectForm clientId={clientId} />
      <ProjectList clientId={clientId} />
    </main>
  );
}
