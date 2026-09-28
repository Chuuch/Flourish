import { notifyError, notifySuccess } from '@/features/toasts';
import { ApiError } from '@/lib/api/errors';
import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import '@/features/toasts/react-query.d.ts';

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onSuccess: (_data, _variables, _onMutateResult, mutation) => {
            const successKey = mutation.meta?.['successKey'];

            if (successKey) {
              notifySuccess(successKey);
            }
          },
          onError: (error, _variables, _onMutateResult, mutation) => {
            if (mutation.meta?.['silent']) {
              return;
            }

            notifyError(error);
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            retry: (failureCount, error) => {
              if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
                return false;
              }
              return failureCount < 2;
            },
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
