import { renderWithProviders } from '@/test/render';
import { useAuthStore } from '@/features/auth';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { RootLayout } from './RootLayout';
import { makeOrganization } from '@/test/factories/organization';
import { makeClient } from '@/test/factories/client';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { env } from '@/config/env';

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

function mockNavCounts() {
  server.use(
    mswHttp.get(`${env.API_URL}/nav/counts`, () =>
      HttpResponse.json({ tasks: 2, tickets: 3, unread_notifications: 1 }),
    ),
    mswHttp.get(`${env.API_URL}/client-auth/nav/counts`, () =>
      HttpResponse.json({ tasks: 0, tickets: 0, unread_notifications: 4 }),
    ),
    mswHttp.get(`${env.API_URL}/clients`, () => HttpResponse.json([])),
  );
}

function renderLayout() {
  return renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<div>page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('RootLayout', () => {
  it('shows the sidebar, theme toggle and language switcher for guests', () => {
    renderLayout();

    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Members' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Reports' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Notifications' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Use dark theme' })).toBeInTheDocument();
    expect(screen.getByLabelText('Language')).toHaveAttribute('data-value', 'en');
    expect(screen.getByText('page')).toBeInTheDocument();
  });

  it('shows staff links when signed in', async () => {
    mockNavCounts();
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    renderLayout();

    expect(await screen.findByRole('link', { name: 'Members' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Clients' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Tasks' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Tickets' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Activity' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Reports' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Notifications' })).toBeInTheDocument();
    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Use dark theme' })).toBeInTheDocument();
    expect(screen.getByLabelText('Language')).toHaveAttribute('data-value', 'en');
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
  });

  it('hides staff links for a client session', async () => {
    mockNavCounts();
    useAuthStore
      .getState()
      .setPortalSession(
        { id: crypto.randomUUID(), email: 'pat@example.com' },
        'token',
        testOrg,
        testClient,
        'client',
      );

    renderLayout();

    expect(await screen.findByText('Northwind')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Notifications' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Members' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Clients' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Reports' })).not.toBeInTheDocument();
  });
});
