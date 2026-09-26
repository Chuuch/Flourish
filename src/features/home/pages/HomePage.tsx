import { paths } from '@/app/router/paths';
import { useAuthStore } from '@/features/auth';
import { InboxList } from '@/features/tasks/components/InboxList';
import { Navigate } from 'react-router';

export function HomePage() {
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);

  if (role === 'client') {
    return <Navigate to={paths.portal} replace />;
  }

  if (!user) {
    return <div>Flourish</div>;
  }

  return (
    <main>
      <h1>Flourish</h1>
      <h2>Inbox</h2>
      <InboxList />;
    </main>
  );
}
