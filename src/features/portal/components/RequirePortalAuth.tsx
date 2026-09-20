import { paths } from '@/app/router/paths';
import { useAuthStore } from '@/features/auth';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

interface RequirePortalAuthProps {
  children: ReactNode;
}

export function RequirePortalAuth({ children }: RequirePortalAuthProps) {
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const location = useLocation();

  if (!user) {
    return <Navigate to={paths.portalLogin} replace state={{ from: location }} />;
  }

  if (role !== 'client') {
    return <Navigate to={paths.home} replace />;
  }

  return children;
}
