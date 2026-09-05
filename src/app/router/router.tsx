import { createBrowserRouter } from 'react-router';
import App from '../App';
import { HomePage } from '@/features/home/pages/HomePage';
import { RouteErrorBoundary } from '@/components/feedback/RouteErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'users',
        lazy: async () => {
          const { UsersPage } = await import('@/features/users');
          return { Component: UsersPage };
        },
      },
    ],
  },
]);
