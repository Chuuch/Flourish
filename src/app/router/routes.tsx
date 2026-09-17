import type { RouteObject } from 'react-router';
import { paths } from './paths';
import { RootLayout } from '../layouts/RootLayout';
import { RouteErrorBoundary } from '@/components/feedback/RouteErrorBoundary';
import { HomePage } from '@/features/home/pages/HomePage';
import { NotFound } from '@/components/feedback/NotFound';
import { PageLoader } from '@/components/feedback/PageLoader';
import { GuestOnly, RequireAuth } from '@/features/auth';
import { MembersPage } from '@/features/members';
import { ClientsPage } from '@/features/clients';
import { ProjectsPage } from '@/features/projects';
import { TasksPage } from '@/features/tasks';
import { TimeEntriesPage } from '@/features/timeentries';
import { FilesPage } from '@/features/files';

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
        path: 'members',
        element: (
          <RequireAuth>
            <MembersPage />
          </RequireAuth>
        ),
      },
      {
        path: 'clients',
        element: (
          <RequireAuth>
            <ClientsPage />
          </RequireAuth>
        ),
      },
      {
        path: 'clients/:clientId/projects',
        element: (
          <RequireAuth>
            <ProjectsPage />
          </RequireAuth>
        ),
      },
      {
        path: 'clients/:clientId/projects/:projectId/tasks',
        element: (
          <RequireAuth>
            <TasksPage />
          </RequireAuth>
        ),
      },
      {
        path: 'clients/:clientId/projects/:projectId/tasks/:taskid/time-entries',
        element: (
          <RequireAuth>
            <TimeEntriesPage />
          </RequireAuth>
        ),
      },
      {
        path: 'clients/:clientId/projects/:projectId/files',
        element: (
          <RequireAuth>
            <FilesPage />
          </RequireAuth>
        ),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
];
