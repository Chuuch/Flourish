import { ClientList } from '../components/ClientList';
import { CreateClientForm } from '../components/CreateClientForm';

export function ClientsPage() {
  return (
    <main>
      <h1>Clients</h1>
      <CreateClientForm />
      <ClientList />
    </main>
  );
}
