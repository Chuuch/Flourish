import { env } from '@/config/env';
import { paths } from '@/app/router/paths';
import { renderWithProviders } from '@/test/render';
import { server } from '@/test/server';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http as mswHttp } from 'msw';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { ResetPasswordForm } from './ResetPasswordForm';

const resetUrl = `${env.API_URL}/auth/reset-password`;

function renderAt(path: string) {
  return renderWithProviders(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={paths.resetPassword} element={<ResetPasswordForm />} />
        <Route path={paths.login} element={<p>Staff sign in page</p>} />
        <Route path={paths.portalLogin} element={<p>Client sign in page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ResetPasswordForm', () => {
  it('shows an error when the token is missing', () => {
    renderAt(paths.resetPassword);

    expect(screen.getByRole('alert')).toHaveTextContent('This reset link is missing a token.');
    expect(screen.queryByRole('button', { name: 'Set password' })).not.toBeInTheDocument();
  });

  it('shows a validation error without calling the API', async () => {
    const user = userEvent.setup();
    renderAt(`${paths.resetPassword}?token=reset-token`);

    await user.type(screen.getByLabelText('Password'), 'short');
    await user.click(screen.getByRole('button', { name: 'Set password' }));

    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();
  });

  it('resets the password and shows sign in links', async () => {
    const user = userEvent.setup();

    server.use(
      mswHttp.post(resetUrl, async ({ request }) => {
        const body = (await request.json()) as { token: string; password: string };
        expect(body.token).toBe('reset-token');
        expect(body.password).toBe('password123');
        return new HttpResponse(null, { status: 204 });
      }),
    );

    renderAt(`${paths.resetPassword}?token=reset-token`);

    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Set password' }));

    expect(
      await screen.findByText('Password updated. Sign in with the password you just set.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Staff sign in' })).toHaveAttribute(
      'href',
      paths.login,
    );
    expect(screen.getByRole('link', { name: 'Client sign in' })).toHaveAttribute(
      'href',
      paths.portalLogin,
    );
  });

  it('shows the server error message', async () => {
    const user = userEvent.setup();

    server.use(
      mswHttp.post(resetUrl, () =>
        HttpResponse.json({ error: { message: 'reset expired' } }, { status: 400 }),
      ),
    );

    renderAt(`${paths.resetPassword}?token=expired`);

    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Set password' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('reset expired');
  });
});
