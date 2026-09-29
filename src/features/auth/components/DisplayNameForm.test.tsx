import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { DisplayNameForm } from './DisplayNameForm';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAuthStore } from '../store/auth.store';

const testOrg = {
  id: crypto.randomUUID(),
  name: 'Acme',
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
};

describe('DisplayNameForm', () => {
  it('saves a display name and updates the session', async () => {
    const user = userEvent.setup();
    const userId = crypto.randomUUID();
    useAuthStore.getState().setSession({ id: userId, email: 'ada@example.com' }, 'token', testOrg, 'owner');

    server.use(
      mswHttp.patch(`${env.API_URL}/auth/display-name`, async ({ request }) => {
        const body = (await request.json()) as { display_name: string };
        expect(body.display_name).toBe('Ada');
        return HttpResponse.json({
          id: userId,
          email: 'ada@example.com',
          display_name: 'Ada',
          created_at: '2026-09-11T11:12:20Z',
          updated_at: '2026-09-11T11:12:20Z',
        });
      }),
    );

    renderWithProviders(<DisplayNameForm />);

    await user.clear(screen.getByLabelText('Display name'));
    await user.type(screen.getByLabelText('Display name'), 'Ada');
    await user.click(screen.getByRole('button', { name: 'Save display name' }));

    await waitFor(() => {
      expect(useAuthStore.getState().user?.display_name).toBe('Ada');
    });
  });
});
