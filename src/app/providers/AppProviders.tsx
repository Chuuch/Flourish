import type { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { SessionGate } from '../layouts/SessionGate';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProviderProps) {
  return (
    <QueryProvider>
      <SessionGate>{children}</SessionGate>
    </QueryProvider>
  );
}
