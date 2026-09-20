import { paths } from '@/app/router/paths';
import { useAuthStore } from '@/features/auth';
import { Navigate } from 'react-router';

export function HomePage() {
  const role = useAuthStore((state) => state.role);

  if (role === 'client') {
    return <Navigate to={paths.portal} replace />;
  }
  return <div>Flourish</div>;
}
