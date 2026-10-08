import type { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { SessionGate } from '../layouts/SessionGate';
import { AppToaster } from '@/features/toasts';
import { RealtimeBridge } from '@/features/realtime/components/RealtimeBridge';
import { ModalProvider } from '@/features/modal';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProviderProps) {
  return (
    <QueryProvider>
      <ModalProvider>
        <AppToaster />
        <SessionGate>
          <RealtimeBridge />
          {children}
        </SessionGate>
      </ModalProvider>
    </QueryProvider>
  );
}
