import type { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProviderProps) {
  return <QueryProvider>{children}</QueryProvider>;
}
