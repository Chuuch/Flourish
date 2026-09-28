import { env } from '@/config/env';
import { paths } from '@/app/router/paths';
import { renderWithProviders } from '@/test/render';
import { server } from '@/test/server';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http as mswHttp } from 'msw';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { useAuthStore } from '../store/auth.store';
import { ChangePasswordForm } from './ChangePasswordForm';

const staffUrl = `${env.API_URL}/auth/change-password`;
const portalUrl = `${env.API_URL}/client-auth/change-password`;

const testOrg = {
  id: crypto.randomUUID(),
  name: 'Acme',
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
};

const testClient = {
  id: crypto.randomUUID(),
  organization_id: testOrg.id,
  name: 'Northwind',
  notes: '',
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
};

function renderForm() {
  return renderWithProviders(
    <MemoryRouter initialEntries={[paths.account]}>
      <Routes>
        <Route path={paths.account} element={<ChangePasswordForm />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ChangePasswordForm', () => {
  it('shows validation errors without calling the API', async () => {
    const user = userEvent.setup();
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    renderForm();

    await user.type(screen.getByLabelText('New password'), 'short');
    await user.click(screen.getByRole('button', { name: 'Change password' }));

    expect(await screen.findByText('Current password is required')).toBeInTheDocument();
    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
  });

  it('changes the staff password', async () => {
    const user = userEvent.setup();
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    server.use(
      mswHttp.post(staffUrl, async ({ request }) => {
        const body = (await request.json()) as { current_password: string; password: string };
        expect(body.current_password).toBe('password123');
        expect(body.password).toBe('newpassword');
        return new HttpResponse(null, { status: 204 });
      }),
    );

    renderForm();

    await user.type(screen.getByLabelText('Current password'), 'password123');
    await user.type(screen.getByLabelText('New password'), 'newpassword');
    await user.click(screen.getByRole('button', { name: 'Change password' }));

    expect(await screen.findByText('Password updated.')).toBeInTheDocument();
  });

  it('changes the portal password', async () => {
    const user = userEvent.setup();
    useAuthStore
      .getState()
      .setPortalSession(
        { id: crypto.randomUUID(), email: 'pat@example.com' },
        'token',
        testOrg,
        testClient,
        'client',
      );

    server.use(
      mswHttp.post(portalUrl, async ({ request }) => {
        const body = (await request.json()) as { current_password: string; password: string };
        expect(body.current_password).toBe('password123');
        expect(body.password).toBe('newpassword');
        return new HttpResponse(null, { status: 204 });
      }),
    );

    renderForm();

    await user.type(screen.getByLabelText('Current password'), 'password123');
    await user.type(screen.getByLabelText('New password'), 'newpassword');
    await user.click(screen.getByRole('button', { name: 'Change password' }));

    expect(await screen.findByText('Password updated.')).toBeInTheDocument();
  });

  it('shows the server error message', async () => {
    const user = userEvent.setup();
    useAuthStore
      .getState()
      .setSession(
        { id: crypto.randomUUID(), email: 'ada@example.com' },
        'token',
        testOrg,
        'member',
      );

    server.use(
      mswHttp.post(staffUrl, () =>
        HttpResponse.json({ error: { message: 'invalid credentials' } }, { status: 401 }),
      ),
    );

    renderForm();

    await user.type(screen.getByLabelText('Current password'), 'wrong-password');
    await user.type(screen.getByLabelText('New password'), 'newpassword');
    await user.click(screen.getByRole('button', { name: 'Change password' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('invalid credentials');
  });
});
