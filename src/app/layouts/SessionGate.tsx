import { PageLoader } from '@/components/feedback/PageLoader';
import { useBootstrapSession } from '@/features/auth/hooks/useBootstrapSession';
import type { ReactNode } from 'react';

interface SessionGateProps {
  children: ReactNode;
}

export function SessionGate({ children }: SessionGateProps) {
  const session = useBootstrapSession();

  if (session.isPending) {
    return <PageLoader />;
  }

  return children;
}
