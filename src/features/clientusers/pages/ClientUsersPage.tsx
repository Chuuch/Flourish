import { clientProjectsPath, paths } from '@/app/router/paths';
import { Link, useParams } from 'react-router';
import { CreateClientUserForm } from '../components/CreateClientUserForm';
import { ClientUserList } from '../components/ClientUserList';

export function ClientUsersPage() {
  const { clientId } = useParams();

  if (!clientId) {
    return (
      <main>
        <h1>Client users</h1>
        <p>Client not found</p>
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
      <h1>Client users</h1>
      <CreateClientUserForm clientId={clientId} />
      <ClientUserList clientId={clientId} />
    </main>
  );
}
