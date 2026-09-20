import { paths } from '@/app/router/paths';
import { useAuthStore } from '@/features/auth';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router';

interface GuestOnlyPortalProps {
  children: ReactNode;
}

export function GuestOnlyPortal({ children }: GuestOnlyPortalProps) {
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);

  if (role === 'client') {
    return <Navigate to={paths.portal} replace />;
  }

  if (user) {
    return <Navigate to={paths.home} replace />;
  }

  return children;
}
