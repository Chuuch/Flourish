import { screen } from '@testing-library/react';
import { HttpResponse, http as mswHttp } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { routes } from '@/app/router/routes';
import { env } from '@/config/env';
import { renderWithProviders } from '@/test/render';
import { server } from '@/test/server';
import { useAuthStore } from '../store/auth.store';
import { makeClient } from '@/test/factories/client';
import { makeProject } from '@/test/factories/project';
import { makeTask } from '@/test/factories/task';
import { makeOrganization } from '@/test/factories/organization';

const testOrg = makeOrganization({
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
});

const testClient = makeClient({
  organization_id: testOrg.id,
  name: 'Northwind',
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
});

const clientId = '44444444-4444-4444-8444-444444444444';

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return renderWithProviders(<RouterProvider router={router} />);
}

describe('RequireAuth', () => {
  it('redirects anonymous users to login', async () => {
    renderAt('/members');

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('renders the protected page when there is a session', async () => {
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    server.use(mswHttp.get(`${env.API_URL}/members`, () => HttpResponse.json([])));

    renderAt('/members');

    expect(await screen.findByRole('heading', { name: 'Members' })).toBeInTheDocument();
  });

  it('sends a client session to the portal', async () => {
    useAuthStore
      .getState()
      .setPortalSession(
        { id: crypto.randomUUID(), email: 'pat@example.com' },
        'token',
        testOrg,
        testClient,
        'client',
      );

    server.use(mswHttp.get(`${env.API_URL}/client-auth/tickets`, () => HttpResponse.json([])));

    renderAt('/members');

    expect(await screen.findByRole('heading', { name: 'Portal' })).toBeInTheDocument();
  });
});

describe('RequireAuth', () => {
  it('redirects anonymous users to login', async () => {
    renderAt('/clients');

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('renders the protected page when there is a session', async () => {
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    server.use(mswHttp.get(`${env.API_URL}/clients`, () => HttpResponse.json([])));

    renderAt('/clients');

    expect(await screen.findByRole('heading', { name: 'Clients' })).toBeInTheDocument();
  });
});

describe('RequireAuth', () => {
  it('redirects anonymous users to login', async () => {
    renderAt(`/clients/${clientId}/users`);

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('renders the protected page when there is a session', async () => {
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    server.use(
      mswHttp.get(`${env.API_URL}/clients/${clientId}/users`, () => HttpResponse.json([])),
    );

    renderAt(`/clients/${clientId}/users`);

    expect(await screen.findByRole('heading', { name: 'Client users' })).toBeInTheDocument();
  });
});

describe('RequireAuth', () => {
  it('redirects anonymous users to login', async () => {
    renderAt(`/clients/${clientId}`);

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('renders the protected page when there is a session', async () => {
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    const client = makeClient({ name: 'Northwind', notes: '' });

    server.use(
      mswHttp.get(`${env.API_URL}/clients`, () => HttpResponse.json([client])),
      mswHttp.get(`${env.API_URL}/clients/${client.id}/projects`, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/clients/${client.id}/tickets`, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/clients/${client.id}/users`, () => HttpResponse.json([])),
    );

    renderAt(`/clients/${client.id}`);

    expect(await screen.findByRole('heading', { name: 'Northwind' })).toBeInTheDocument();
  });
});

describe('RequireAuth', () => {
  it('redirects anonymous users to login', async () => {
    const client = makeClient();
    const project = makeProject({ client_id: client.id });

    renderAt(`/clients/${client.id}/projects/${project.id}`);

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('renders the protected page when there is a session', async () => {
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    const project = makeProject({ name: 'Website', notes: '' });

    server.use(
      mswHttp.get(`${env.API_URL}/clients/${project.client_id}/projects`, () =>
        HttpResponse.json([project]),
      ),
      mswHttp.get(`${env.API_URL}/projects/${project.id}/tasks`, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/projects/${project.id}/files`, () => HttpResponse.json([])),
    );

    renderAt(`/clients/${project.client_id}/projects/${project.id}`);

    expect(await screen.findByRole('heading', { name: 'Website' })).toBeInTheDocument();
  });
});

describe('RequireAuth', () => {
  it('redirects anonymous users to login', async () => {
    const client = makeClient();
    const project = makeProject({ client_id: client.id });
    const task = makeTask({ project_id: project.id });

    renderAt(`/clients/${client.id}/projects/${project.id}/tasks/${task.id}`);

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('renders the protected page when there is a session', async () => {
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    const project = makeProject({ name: 'Website', notes: '' });
    const task = makeTask({ project_id: project.id, title: 'Fix login', notes: '' });

    server.use(
      mswHttp.get(`${env.API_URL}/members`, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/projects/${project.id}/tasks`, () => HttpResponse.json([task])),
      mswHttp.get(`${env.API_URL}/tasks/${task.id}/comments`, () => HttpResponse.json([])),
      mswHttp.get(`${env.API_URL}/tasks/${task.id}/time-entries`, () => HttpResponse.json([])),
    );

    renderAt(`/clients/${project.client_id}/projects/${project.id}/tasks/${task.id}`);

    expect(await screen.findByRole('heading', { name: 'Fix login' })).toBeInTheDocument();
  });
});
