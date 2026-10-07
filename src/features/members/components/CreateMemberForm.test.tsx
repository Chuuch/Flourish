import { env } from '@/config/env';
import { renderWithProviders } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { chooseSelectOption } from '@/test/select';
import { describe, expect, it } from 'vitest';
import { CreateMemberForm } from './CreateMemberForm';
import { screen, waitFor, within } from '@testing-library/react';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { createMemberSchema, type Member } from '../schemas/member.schema';
import { makeMember } from '@/test/factories/member';
import { useAuthStore } from '@/features/auth';
import { MembersPage } from '../pages/MembersPage';
import { makeOrganization } from '@/test/factories/organization';

const membersUrl = `${env.API_URL}/members`;

const testOrg = makeOrganization({
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
});

function signInAs(role: 'owner' | 'admin' | 'member') {
  useAuthStore
    .getState()
    .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, role);
}

describe('CreateMemberForm', () => {
  it('hides the form for members', () => {
    signInAs('member');
    renderWithProviders(<CreateMemberForm />);

    expect(screen.queryByRole('button', { name: 'Invite member' })).not.toBeInTheDocument();
  });

  it('shows a validation error without calling the API', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    renderWithProviders(<CreateMemberForm />);

    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.click(screen.getByRole('button', { name: 'Invite member' }));

    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
  });

  it('creates a member and refreshes the list', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    const members: Member[] = [];

    server.use(
      mswHttp.get(membersUrl, () => HttpResponse.json(members)),
      mswHttp.post(membersUrl, async ({ request }) => {
        const input = createMemberSchema.parse(await request.json());
        const created = makeMember({ email: input.email, role: input.role });
        members.push(created);
        return HttpResponse.json(created, { status: 201 });
      }),
    );

    renderWithProviders(<MembersPage />);
    expect(await screen.findByText('No members yet.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Invite member' }));
    const dialog = await screen.findByRole('dialog');

    await user.type(within(dialog).getByLabelText('Email'), 'grace@example.com');
    await chooseSelectOption(user, 'Role', 'admin');
    await user.click(within(dialog).getByRole('button', { name: 'Invite member' }));

    expect(await screen.findByText('grace@example.com')).toBeInTheDocument();
    expect(document.querySelector('[data-role="admin"]')).toHaveTextContent('Admin');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('shows the server error message', async () => {
    const user = userEvent.setup();
    signInAs('admin');
    server.use(
      mswHttp.post(membersUrl, () =>
        HttpResponse.json({ error: { message: 'member already exists' } }, { status: 409 }),
      ),
    );

    renderWithProviders(<CreateMemberForm />);

    await user.type(screen.getByLabelText('Email'), 'taken@example.com');
    await user.click(screen.getByRole('button', { name: 'Invite member' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('member already exists');
  });
});
