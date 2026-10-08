import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { OrganizationNameForm } from './OrganizationNameForm';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAuthStore } from '@/features/auth';
import { makeOrganization } from '@/test/factories/organization';

const testOrg = makeOrganization({
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
});

function signInAs(role: 'owner' | 'admin' | 'member') {
  useAuthStore
    .getState()
    .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, role);
}

describe('OrganizationNameForm', () => {
  it('hides the form for members', () => {
    signInAs('member');
    renderWithProviders(<OrganizationNameForm />);

    expect(screen.queryByLabelText('Organization name')).not.toBeInTheDocument();
  });

  it('renames the organization', async () => {
    const user = userEvent.setup();
    signInAs('owner');

    server.use(
      mswHttp.patch(`${env.API_URL}/organization`, async ({ request }) => {
        const body = (await request.json()) as { name: string; default_vat_rate_bps: number };
        expect(body.name).toBe('Northwind');
        expect(body.default_vat_rate_bps).toBe(2000);
        return HttpResponse.json({
          ...testOrg,
          name: body.name,
        });
      }),
    );

    renderWithProviders(<OrganizationNameForm />);

    expect(screen.getByLabelText('Default VAT rate (%)')).toHaveValue(20);

    await user.clear(screen.getByLabelText('Organization name'));
    await user.type(screen.getByLabelText('Organization name'), 'Northwind');
    await user.click(screen.getByRole('button', { name: 'Save organization' }));

    await waitFor(() => {
      expect(useAuthStore.getState().organization?.name).toBe('Northwind');
    });
  });
});
