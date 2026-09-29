import type { RouteObject } from 'react-router';
import { Outlet } from 'react-router';
import { paths } from './paths';
import { RootLayout } from '../layouts/RootLayout';
import { RouteErrorBoundary } from '@/components/feedback/RouteErrorBoundary';
import { HomePage } from '@/features/home/pages/HomePage';
import { NotFound } from '@/components/feedback/NotFound';
import { PageLoader } from '@/components/feedback/PageLoader';
import { RequireAuth } from '@/features/auth/components/RequireAuth';

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
          const { LoginPage } = await import('@/features/auth/pages/LoginPage');
          const { GuestOnly } = await import('@/features/auth/components/GuestOnly');
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
          const { RegisterPage } = await import('@/features/auth/pages/RegisterPage');
          const { GuestOnly } = await import('@/features/auth/components/GuestOnly');
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
        path: 'accept-invite',
        HydrateFallback: PageLoader,
        lazy: async () => {
          const { AcceptInvitePage } = await import('@/features/auth/pages/AcceptInvitePage');
          const { GuestOnly } = await import('@/features/auth/components/GuestOnly');
          return {
            Component: function AcceptInviteRoute() {
              return (
                <GuestOnly>
                  <AcceptInvitePage />
                </GuestOnly>
              );
            },
          };
        },
      },
      {
        path: 'forgot-password',
        HydrateFallback: PageLoader,
        lazy: async () => {
          const { ForgotPasswordPage } = await import('@/features/auth/pages/ForgotPasswordPage');
          const { GuestOnly } = await import('@/features/auth/components/GuestOnly');
          return {
            Component: function ForgotPasswordRoute() {
              return (
                <GuestOnly>
                  <ForgotPasswordPage />
                </GuestOnly>
              );
            },
          };
        },
      },
      {
        path: 'reset-password',
        HydrateFallback: PageLoader,
        lazy: async () => {
          const { ResetPasswordPage } = await import('@/features/auth/pages/ResetPasswordPage');
          const { GuestOnly } = await import('@/features/auth/components/GuestOnly');
          return {
            Component: function ResetPasswordRoute() {
              return (
                <GuestOnly>
                  <ResetPasswordPage />
                </GuestOnly>
              );
            },
          };
        },
      },
      {
        path: 'account',
        HydrateFallback: PageLoader,
        lazy: async () => {
          const { ChangePasswordPage } = await import('@/features/auth/pages/ChangePasswordPage');
          const { RequireAuth: RequireStaffAuth } =
            await import('@/features/auth/components/RequireAuth');
          return {
            Component: function AccountRoute() {
              return (
                <RequireStaffAuth>
                  <ChangePasswordPage />
                </RequireStaffAuth>
              );
            },
          };
        },
      },
      {
        path: 'portal',
        element: <Outlet />,
        children: [
          {
            index: true,
            HydrateFallback: PageLoader,
            lazy: async () => {
              const { PortalHomePage } = await import('@/features/portal/pages/PortalHomePage');
              const { RequirePortalAuth } =
                await import('@/features/portal/components/RequirePortalAuth');
              return {
                Component: function PortalHomeRoute() {
                  return (
                    <RequirePortalAuth>
                      <PortalHomePage />
                    </RequirePortalAuth>
                  );
                },
              };
            },
          },
          {
            path: 'login',
            HydrateFallback: PageLoader,
            lazy: async () => {
              const { PortalLoginPage } = await import('@/features/portal/pages/PortalLoginPage');
              const { GuestOnlyPortal } =
                await import('@/features/portal/components/GuestOnlyPortal');
              return {
                Component: function PortalLoginRoute() {
                  return (
                    <GuestOnlyPortal>
                      <PortalLoginPage />
                    </GuestOnlyPortal>
                  );
                },
              };
            },
          },
          {
            path: 'account',
            HydrateFallback: PageLoader,
            lazy: async () => {
              const { ChangePasswordPage } =
                await import('@/features/auth/pages/ChangePasswordPage');
              const { RequirePortalAuth } =
                await import('@/features/portal/components/RequirePortalAuth');
              return {
                Component: function PortalAccountRoute() {
                  return (
                    <RequirePortalAuth>
                      <ChangePasswordPage />
                    </RequirePortalAuth>
                  );
                },
              };
            },
          },
        ],
      },
      {
        path: 'members',
        HydrateFallback: PageLoader,
        lazy: async () => {
          const { MembersPage } = await import('@/features/members/pages/MambersPage');
          const { RequireAuth: RequireStaffAuth } =
            await import('@/features/auth/components/RequireAuth');
          return {
            Component: function MembersRoute() {
              return (
                <RequireStaffAuth>
                  <MembersPage />
                </RequireStaffAuth>
              );
            },
          };
        },
      },
      {
        path: 'clients',
        element: (
          <RequireAuth>
            <Outlet />
          </RequireAuth>
        ),
        children: [
          {
            index: true,
            HydrateFallback: PageLoader,
            lazy: async () => {
              const { ClientsPage } = await import('@/features/clients/pages/ClientsPage');
              return { Component: ClientsPage };
            },
          },
          {
            path: ':clientId',
            element: <Outlet />,
            children: [
              {
                index: true,
                HydrateFallback: PageLoader,
                lazy: async () => {
                  const { ClientPage } = await import('@/features/clients/pages/ClientPage');
                  return { Component: ClientPage };
                },
              },
              {
                path: 'users',
                HydrateFallback: PageLoader,
                lazy: async () => {
                  const { ClientUsersPage } =
                    await import('@/features/clientusers/pages/ClientUsersPage');
                  return { Component: ClientUsersPage };
                },
              },
              {
                path: 'tickets',
                HydrateFallback: PageLoader,
                lazy: async () => {
                  const { AgencyTicketsPage } =
                    await import('@/features/tickets/pages/AgencyTicketsPage');
                  return { Component: AgencyTicketsPage };
                },
              },
              {
                path: 'projects',
                element: <Outlet />,
                children: [
                  {
                    index: true,
                    HydrateFallback: PageLoader,
                    lazy: async () => {
                      const { ProjectsPage } =
                        await import('@/features/projects/pages/ProjectPage');
                      return { Component: ProjectsPage };
                    },
                  },
                  {
                    path: ':projectId',
                    element: <Outlet />,
                    children: [
                      {
                        index: true,
                        HydrateFallback: PageLoader,
                        lazy: async () => {
                          const { ProjectHubPage } =
                            await import('@/features/projects/pages/ProjectHubPage');
                          return { Component: ProjectHubPage };
                        },
                      },
                      {
                        path: 'tasks',
                        element: <Outlet />,
                        children: [
                          {
                            index: true,
                            HydrateFallback: PageLoader,
                            lazy: async () => {
                              const { TasksPage } =
                                await import('@/features/tasks/pages/TasksPage');
                              return { Component: TasksPage };
                            },
                          },
                          {
                            path: ':taskid/time-entries',
                            HydrateFallback: PageLoader,
                            lazy: async () => {
                              const { TimeEntriesPage } =
                                await import('@/features/timeentries/pages/TimeEntriesPage');
                              return { Component: TimeEntriesPage };
                            },
                          },
                          {
                            path: ':taskid/comments',
                            HydrateFallback: PageLoader,
                            lazy: async () => {
                              const { CommentsPage } =
                                await import('@/features/comments/pages/CommentsPage');
                              return { Component: CommentsPage };
                            },
                          },
                        ],
                      },
                      {
                        path: 'files',
                        HydrateFallback: PageLoader,
                        lazy: async () => {
                          const { FilesPage } = await import('@/features/files/pages/FilesPage');
                          return { Component: FilesPage };
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
];
