import type { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { SessionGate } from '../layouts/SessionGate';
import { AppToaster } from '@/features/toasts';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProviderProps) {
  return (
    <QueryProvider>
      <AppToaster />
      <SessionGate>{children}</SessionGate>
    </QueryProvider>
  );
}
