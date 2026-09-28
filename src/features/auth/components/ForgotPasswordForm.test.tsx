import { env } from '@/config/env';
import { paths } from '@/app/router/paths';
import { renderWithProviders } from '@/test/render';
import { server } from '@/test/server';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http as mswHttp } from 'msw';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { ForgotPasswordForm } from './ForgotPasswordForm';

const forgotUrl = `${env.API_URL}/auth/forgot-password`;

function renderForm() {
  return renderWithProviders(
    <MemoryRouter initialEntries={[paths.forgotPassword]}>
      <Routes>
        <Route path={paths.forgotPassword} element={<ForgotPasswordForm />} />
        <Route path={paths.login} element={<p>Staff sign in page</p>} />
        <Route path={paths.portalLogin} element={<p>Client sign in page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ForgotPasswordForm', () => {
  it('shows a validation error without calling the API', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.click(screen.getByRole('button', { name: 'Send reset link' }));

    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
  });

  it('shows the same success copy after a 204', async () => {
    const user = userEvent.setup();

    server.use(
      mswHttp.post(forgotUrl, async ({ request }) => {
        const body = (await request.json()) as { email: string };
        expect(body.email).toBe('ada@example.com');
        return new HttpResponse(null, { status: 204 });
      }),
    );

    renderForm();

    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.click(screen.getByRole('button', { name: 'Send reset link' }));

    expect(
      await screen.findByText('If that email is registered, we sent a reset link.'),
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
      mswHttp.post(forgotUrl, () =>
        HttpResponse.json({ error: { message: 'internal server error' } }, { status: 500 }),
      ),
    );

    renderForm();

    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.click(screen.getByRole('button', { name: 'Send reset link' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('internal server error');
  });
});
