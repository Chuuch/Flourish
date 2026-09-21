import { clientProjectsPath, paths } from '@/app/router/paths';
import { Link, useParams } from 'react-router';
import { AgencyTicketList } from '../components/AgencyTicketList';

export function AgencyTicketsPage() {
  const { clientId } = useParams();

  if (!clientId) {
    return (
      <main>
        <h1>Tickets</h1>
        <p>Client not found.</p>
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
      <h1>Tickets</h1>
      <AgencyTicketList clientId={clientId} />
    </main>
  );
}
