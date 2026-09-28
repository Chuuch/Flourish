import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { TicketCommentList } from './TicketCommentList';
import { screen } from '@testing-library/react';
import { makeTicketComment } from '@/test/factories/ticket-comment';
import { useAuthStore } from '@/features/auth';
import userEvent from '@testing-library/user-event';
import { updateTicketCommentSchema, type TicketComment } from '../schemas/ticket-comment.schema';

const ticketId = '99999999-9999-9999-9999-999999999999';
const portalUrl = `${env.API_URL}/client-auth/tickets/${ticketId}/comments`;
const staffUrl = `${env.API_URL}/tickets/${ticketId}/comments`;
const actorUserId = '11111111-1111-1111-1111-111111111111';

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

function signInAs(role: 'owner' | 'admin' | 'member', userId = actorUserId) {
  useAuthStore
    .getState()
    .setSession({ id: userId, email: 'ada@example.com' }, 'token', testOrg, role);
}

function signInPortal(userId = actorUserId) {
  useAuthStore
    .getState()
    .setPortalSession(
      { id: userId, email: 'pat@northwind.test' },
      'token',
      testOrg,
      testClient,
      'client',
    );
}

describe('TicketCommentList', () => {
  it('renders comments returned by the portal API', async () => {
    const authorId = crypto.randomUUID();
    const comment = makeTicketComment({
      ticket_id: ticketId,
      user_id: authorId,
      body: 'Can you try another browser?',
    });

    server.use(
      mswHttp.get(portalUrl, () =>
        HttpResponse.json([
          comment,
          makeTicketComment({ ticket_id: ticketId, body: 'Still broken on Safari' }),
        ]),
      ),
    );

    renderWithProviders(<TicketCommentList ticketId={ticketId} />);

    expect(
      await screen.findByText(`${authorId} - Can you try another browser?`),
    ).toBeInTheDocument();
    expect(screen.getByText(/Still broken on Safari/)).toBeInTheDocument();
  });

  it('requests the staff path', async () => {
    server.use(
      mswHttp.get(staffUrl, () =>
        HttpResponse.json([makeTicketComment({ ticket_id: ticketId, body: 'Staff reply' })]),
      ),
    );

    renderWithProviders(<TicketCommentList ticketId={ticketId} source="staff" />);

    expect(await screen.findByText(/Staff reply/)).toBeInTheDocument();
  });

  it('renders an empty state', async () => {
    server.use(mswHttp.get(portalUrl, () => HttpResponse.json([])));
    renderWithProviders(<TicketCommentList ticketId={ticketId} />);

    expect(await screen.findByText('No comments yet.')).toBeInTheDocument();
  });

  it('renders the API error response', async () => {
    server.use(
      mswHttp.get(portalUrl, () =>
        HttpResponse.json({ error: { message: 'ticket not found' } }, { status: 404 }),
      ),
    );

    renderWithProviders(<TicketCommentList ticketId={ticketId} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('ticket not found');
  });

  it('hides manage controls on another portal user comment', async () => {
    signInPortal();
    server.use(
      mswHttp.get(portalUrl, () =>
        HttpResponse.json([
          makeTicketComment({
            user_id: actorUserId,
            body: 'Still broken on Safari',
          }),
          makeTicketComment({
            user_id: crypto.randomUUID(),
            body: 'Can you try another browser?',
          }),
        ]),
      ),
    );

    renderWithProviders(<TicketCommentList ticketId={ticketId} />);

    expect(await screen.findByLabelText('Comment for Still broken on Safari')).toBeInTheDocument();
    expect(
      screen.queryByLabelText('Comment for Can you try another browser?'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Remove Can you try another browser?' }),
    ).not.toBeInTheDocument();
  });

  it('updates a portal comment', async () => {
    const user = userEvent.setup();
    signInPortal();
    let comment: TicketComment = makeTicketComment({
      user_id: actorUserId,
      body: 'Still broken on Safari',
    });

    server.use(
      mswHttp.get(portalUrl, () => HttpResponse.json([comment])),
      mswHttp.patch(
        `${env.API_URL}/client-auth/ticket-comments/${comment.id}`,
        async ({ request }) => {
          const input = updateTicketCommentSchema.parse(await request.json());
          comment = { ...comment, body: input.body };
          return HttpResponse.json(comment);
        },
      ),
    );

    renderWithProviders(<TicketCommentList ticketId={ticketId} />);

    expect(await screen.findByLabelText('Comment for Still broken on Safari')).toHaveValue(
      'Still broken on Safari',
    );

    await user.clear(screen.getByLabelText('Comment for Still broken on Safari'));
    await user.type(
      screen.getByLabelText('Comment for Still broken on Safari'),
      'Works after refresh',
    );
    await user.click(screen.getByRole('button', { name: 'Save Still broken on Safari' }));

    expect(await screen.findByText(`${actorUserId} - Works after refresh`)).toBeInTheDocument();
  });

  it('removes a portal comment', async () => {
    const user = userEvent.setup();
    signInPortal();
    const comment = makeTicketComment({
      user_id: actorUserId,
      body: 'Still broken on Safari',
    });
    let comments: TicketComment[] = [comment];

    server.use(
      mswHttp.get(portalUrl, () => HttpResponse.json(comments)),
      mswHttp.delete(`${env.API_URL}/client-auth/ticket-comments/${comment.id}`, () => {
        comments = [];
        return new HttpResponse(null, { status: 204 });
      }),
    );

    renderWithProviders(<TicketCommentList ticketId={ticketId} />);

    await user.click(await screen.findByRole('button', { name: 'Remove Still broken on Safari' }));

    expect(await screen.findByText('No comments yet.')).toBeInTheDocument();
  });

  it('updates a staff comment', async () => {
    const user = userEvent.setup();
    signInAs('admin');
    let comment: TicketComment = makeTicketComment({
      user_id: crypto.randomUUID(),
      body: 'Staff reply',
    });

    server.use(
      mswHttp.get(staffUrl, () => HttpResponse.json([comment])),
      mswHttp.patch(`${env.API_URL}/ticket-comments/${comment.id}`, async ({ request }) => {
        const input = updateTicketCommentSchema.parse(await request.json());
        comment = { ...comment, body: input.body };
        return HttpResponse.json(comment);
      }),
    );

    renderWithProviders(<TicketCommentList ticketId={ticketId} source="staff" />);

    await user.clear(await screen.findByLabelText('Comment for Staff reply'));
    await user.type(screen.getByLabelText('Comment for Staff reply'), 'Need a HAR file');
    await user.click(screen.getByRole('button', { name: 'Save Staff reply' }));

    expect(await screen.findByText(`${comment.user_id} - Need a HAR file`)).toBeInTheDocument();
  });

  it('hides manage controls on another staff member comment', async () => {
    signInAs('member');
    server.use(
      mswHttp.get(staffUrl, () =>
        HttpResponse.json([
          makeTicketComment({
            user_id: actorUserId,
            body: 'Need a HAR file',
          }),
          makeTicketComment({
            user_id: crypto.randomUUID(),
            body: 'Staff reply',
          }),
        ]),
      ),
    );

    renderWithProviders(<TicketCommentList ticketId={ticketId} source="staff" />);

    expect(await screen.findByLabelText('Comment for Need a HAR file')).toBeInTheDocument();
    expect(screen.queryByLabelText('Comment for Staff reply')).not.toBeInTheDocument();
  });

  it('shows a forbidden error from the API', async () => {
    const user = userEvent.setup();
    signInPortal();
    const comment = makeTicketComment({
      user_id: actorUserId,
      body: 'Still broken on Safari',
    });

    server.use(
      mswHttp.get(portalUrl, () => HttpResponse.json([comment])),
      mswHttp.patch(`${env.API_URL}/client-auth/ticket-comments/${comment.id}`, () =>
        HttpResponse.json({ error: { code: 'forbidden', message: 'forbidden' } }, { status: 403 }),
      ),
    );

    renderWithProviders(<TicketCommentList ticketId={ticketId} />);

    await user.click(await screen.findByRole('button', { name: 'Save Still broken on Safari' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('forbidden');
  });

  it('shows a not-found error from the API', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    const comment = makeTicketComment({ body: 'Staff reply' });

    server.use(
      mswHttp.get(staffUrl, () => HttpResponse.json([comment])),
      mswHttp.delete(`${env.API_URL}/ticket-comments/${comment.id}`, () =>
        HttpResponse.json(
          { error: { code: 'comment_not_found', message: 'comment not found' } },
          { status: 404 },
        ),
      ),
    );

    renderWithProviders(<TicketCommentList ticketId={ticketId} source="staff" />);

    await user.click(await screen.findByRole('button', { name: 'Remove Staff reply' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('comment not found');
  });
});
