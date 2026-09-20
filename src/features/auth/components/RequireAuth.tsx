import { Navigate, useLocation } from 'react-router';
import { useAuthStore } from '../store/auth.store';
import { paths } from '@/app/router/paths';
import type { ReactNode } from 'react';

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const location = useLocation();

  if (!user) {
    return <Navigate to={paths.login} replace state={{ from: location }} />;
  }

  if (role === 'client') {
    return <Navigate to={paths.portal} replace />;
  }

  return children;
}
