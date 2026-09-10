import type { ReactNode } from 'react';
import { useAuthStore } from '../store/auth.store';
import { Navigate } from 'react-router';
import { paths } from '@/app/router/paths';

interface GuestOnlyProps {
  children: ReactNode;
}

export function GuestOnly({ children }: GuestOnlyProps) {
  const user = useAuthStore((state) => state.user);

  if (user) {
    return <Navigate to={paths.home} replace />;
  }

  return children;
}
