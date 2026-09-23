import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { MemberList } from './MemberList';
import { screen } from '@testing-library/react';
import { makeMember } from '@/test/factories/member';
import { useAuthStore } from '@/features/auth';
import userEvent from '@testing-library/user-event';
import { updateMemberSchema, type Member } from '../schemas/member.schema';

const membersUrl = `${env.API_URL}/members`;

const testOrg = {
  id: crypto.randomUUID(),
  name: 'Acme',
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
};

function signInAs(role: 'owner' | 'admin' | 'member') {
  useAuthStore
    .getState()
    .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, role);
}

describe('MemberList', () => {
  it('renders members returned by the API', async () => {
    server.use(
      mswHttp.get(membersUrl, () =>
        HttpResponse.json([
          makeMember({ email: 'ada@example.com', role: 'owner' }),
          makeMember({ email: 'linus@example.com', role: 'member' }),
        ]),
      ),
    );

    renderWithProviders(<MemberList />);

    expect(await screen.findByText('ada@example.com - owner')).toBeInTheDocument();
    expect(screen.getByText('linus@example.com - member')).toBeInTheDocument();
  });

  it('renders an empty state', async () => {
    server.use(mswHttp.get(membersUrl, () => HttpResponse.json([])));
    renderWithProviders(<MemberList />);

    expect(await screen.findByText('No members yet.')).toBeInTheDocument();
  });

  it('renders the API error message', async () => {
    server.use(
      mswHttp.get(membersUrl, () =>
        HttpResponse.json({ error: { message: 'Database unavailable' } }, { status: 503 }),
      ),
    );

    renderWithProviders(<MemberList />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Database unavailable');
  });

  it('hides manage controls for members', async () => {
    signInAs('member');
    server.use(
      mswHttp.get(membersUrl, () =>
        HttpResponse.json([
          makeMember({ email: 'ada@example.com', role: 'owner' }),
          makeMember({ email: 'linus@example.com', role: 'member' }),
        ]),
      ),
    );

    renderWithProviders(<MemberList />);

    expect(await screen.findByText('linus@example.com - member')).toBeInTheDocument();
    expect(screen.queryByLabelText('Role for linus@example.com')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Remove linus@example.com' }),
    ).not.toBeInTheDocument();
  });

  it('updates a member role', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    let member: Member = makeMember({ email: 'linus@example.com', role: 'member' });

    server.use(
      mswHttp.get(membersUrl, () => HttpResponse.json([member])),
      mswHttp.patch(`${membersUrl}/${member.user_id}`, async ({ request }) => {
        const input = updateMemberSchema.parse(await request.json());
        member = { ...member, role: input.role };
        return HttpResponse.json(member);
      }),
    );

    renderWithProviders(<MemberList />);

    expect(await screen.findByLabelText('Role for linus@example.com')).toHaveValue('member');

    await user.selectOptions(screen.getByLabelText('Role for linus@example.com'), 'admin');

    expect(await screen.findByText('linus@example.com - admin')).toBeInTheDocument();
    expect(screen.getByLabelText('Role for linus@example.com')).toHaveValue('admin');
  });

  it('removes a member', async () => {
    const user = userEvent.setup();
    signInAs('admin');
    const member = makeMember({ email: 'linus@example.com', role: 'member' });
    let members: Member[] = [member];

    server.use(
      mswHttp.get(membersUrl, () => HttpResponse.json(members)),
      mswHttp.delete(`${membersUrl}/${member.user_id}`, () => {
        members = [];
        return new HttpResponse(null, { status: 204 });
      }),
    );

    renderWithProviders(<MemberList />);

    await user.click(await screen.findByRole('button', { name: 'Remove linus@example.com' }));

    expect(await screen.findByText('No members yet.')).toBeInTheDocument();
  });

  it('shows the last-owner error from the API', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    const owner = makeMember({ email: 'ada@example.com', role: 'owner' });

    server.use(
      mswHttp.get(membersUrl, () => HttpResponse.json([owner])),
      mswHttp.delete(`${membersUrl}/${owner.user_id}`, () =>
        HttpResponse.json(
          { error: { code: 'last_owner', message: 'cannot remove the last owner' } },
          { status: 409 },
        ),
      ),
    );

    renderWithProviders(<MemberList />);

    await user.click(await screen.findByRole('button', { name: 'Remove ada@example.com' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('cannot remove the last owner');
  });
});
