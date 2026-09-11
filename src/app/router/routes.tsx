import type { RouteObject } from 'react-router';
import { paths } from './paths';
import { RootLayout } from '../layouts/RootLayout';
import { RouteErrorBoundary } from '@/components/feedback/RouteErrorBoundary';
import { HomePage } from '@/features/home/pages/HomePage';
import { NotFound } from '@/components/feedback/NotFound';
import { PageLoader } from '@/components/feedback/PageLoader';
import { GuestOnly, RequireAuth } from '@/features/auth';
import { UsersPage } from '@/features/users';

export const routes: RouteObject[] = [
  {
    path: paths.home,
    element: <RootLayout />,
    ErrorBoundary: RouteErrorBoundary,
    HydrateFallback: PageLoader,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'login',
        HydrateFallback: PageLoader,
        lazy: async () => {
          const { LoginPage } = await import('@/features/auth');
          return {
            Component: function LoginRoute() {
              return (
                <GuestOnly>
                  <LoginPage />
                </GuestOnly>
              );
            },
          };
        },
      },
      {
        path: 'register',
        HydrateFallback: PageLoader,
        lazy: async () => {
          const { RegisterPage } = await import('@/features/auth');
          return {
            Component: function RegisterRoute() {
              return (
                <GuestOnly>
                  <RegisterPage />
                </GuestOnly>
              );
            },
          };
        },
      },
      {
        path: 'users',
        element: (
          <RequireAuth>
            <UsersPage />
          </RequireAuth>
        ),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
];
