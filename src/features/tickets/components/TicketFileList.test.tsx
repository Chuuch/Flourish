import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { TicketFileList } from './TicketFileList';
import { screen } from '@testing-library/react';
import { makeTicketFile } from '@/test/factories/ticket-file';

const ticketId = '99999999-9999-9999-9999-999999999999';
const filesUrl = `${env.API_URL}/client-auth/tickets/${ticketId}/files`;

describe('TicketFileList', () => {
  it('renders files returned by the API', async () => {
    const screenshot = makeTicketFile({
      ticket_id: ticketId,
      filename: 'bug.png',
      size: 2048,
      download_url: 'https://minio.example/bug.png',
    });

    server.use(
      mswHttp.get(filesUrl, () =>
        HttpResponse.json([screenshot, makeTicketFile({ filename: 'notes.txt', size: 12 })]),
      ),
    );

    renderWithProviders(<TicketFileList ticketId={ticketId} />);

    expect(await screen.findByRole('link', { name: 'bug.png (2048 bytes)' })).toHaveAttribute(
      'href',
      screenshot.download_url,
    );
    expect(screen.getByText('notes.txt (12 bytes)')).toBeInTheDocument();
  });

  it('renders an empty state', async () => {
    server.use(mswHttp.get(filesUrl, () => HttpResponse.json([])));
    renderWithProviders(<TicketFileList ticketId={ticketId} />);

    expect(await screen.findByText('No attachments yet.')).toBeInTheDocument();
  });

  it('renders the API error response', async () => {
    server.use(
      mswHttp.get(filesUrl, () =>
        HttpResponse.json({ error: { message: 'ticket not found' } }, { status: 404 }),
      ),
    );

    renderWithProviders(<TicketFileList ticketId={ticketId} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('ticket not found');
  });
});
