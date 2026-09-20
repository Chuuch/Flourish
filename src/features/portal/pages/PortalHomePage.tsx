import { useAuthStore } from '@/features/auth';

export function PortalHomePage() {
  const user = useAuthStore((state) => state.user);
  const client = useAuthStore((state) => state.client);

  return (
    <main>
      <h1>Portal</h1>
      {user ? <p>{user.email}</p> : null}
      {client ? <p>{client.name}</p> : null}
    </main>
  );
}
