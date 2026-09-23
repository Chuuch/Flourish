import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { TicketCommentList } from './TicketCommentList';
import { screen } from '@testing-library/react';
import { makeTicketComment } from '@/test/factories/ticket-comment';

const ticketId = '99999999-9999-9999-9999-999999999999';
const portalUrl = `${env.API_URL}/client-auth/tickets/${ticketId}/comments`;
const staffUrl = `${env.API_URL}/tickets/${ticketId}/comments`;

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
});
