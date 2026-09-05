import type { RouteObject } from 'react-router';
import { paths } from './paths';
import { RootLayout } from '../layouts/RootLayout';
import { RouteErrorBoundary } from '@/components/feedback/RouteErrorBoundary';
import { HomePage } from '@/features/home/pages/HomePage';
import { NotFound } from '@/components/feedback/NotFound';

export const routes: RouteObject[] = [
  {
    path: paths.home,
    element: <RootLayout />,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: paths.users,
        lazy: async () => {
          const { UsersPage } = await import('@/features/users');
          return { Component: UsersPage };
        },
      },
      { path: '*', element: <NotFound /> },
    ],
  },
];
