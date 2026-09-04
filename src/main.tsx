import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.css';
import { AppProviders } from './app/providers/AppProviders.tsx';
import { RouterProvider } from 'react-router';
import { router } from './app/router/router.tsx';
import './lib/api/setup';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}


createRoot(rootElement).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
);
