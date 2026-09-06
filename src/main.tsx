import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.css';
import { AppProviders } from './app/providers/AppProviders.tsx';
import { RouterProvider } from 'react-router';
import { router } from './app/router/router.tsx';
import { ErrorBoundary } from './components/feedback/ErrorBoundary.tsx';
import { initSentry } from './lib/observability/sentry.ts';

initSentry();

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </ErrorBoundary>
  </StrictMode>,
);
