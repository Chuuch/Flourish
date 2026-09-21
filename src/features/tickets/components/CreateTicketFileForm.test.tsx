import { env } from '@/config/env';
import { renderWithProviders } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CreateTicketFileForm } from './CreateTicketFileForm';
import { TicketFileList } from './TicketFileList';
import { screen } from '@testing-library/react';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { type TicketFile } from '../schemas/ticket-file.schema';
import { makeTicketFile } from '@/test/factories/ticket-file';

const ticketId = '99999999-9999-9999-9999-999999999999';
const filesUrl = `${env.API_URL}/client-auth/tickets/${ticketId}/files`;
const uploadUrl = `${env.API_URL}/storage-put`;

describe('CreateTicketFileForm', () => {
  it('shows a validation error without calling the API', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateTicketFileForm ticketId={ticketId} />);

    await user.click(screen.getByRole('button', { name: 'Upload' }));

    expect(await screen.findByText('File is required')).toBeInTheDocument();
  });

  it('uploads a file and refreshes the list', async () => {
    const user = userEvent.setup();
    const files: TicketFile[] = [];

    server.use(
      mswHttp.get(filesUrl, () => HttpResponse.json(files)),
      mswHttp.post(filesUrl, async ({ request }) => {
        const body = (await request.json()) as {
          filename: string;
          content_type: string;
          size: number;
        };
        const created = makeTicketFile({
          ticket_id: ticketId,
          filename: body.filename,
          content_type: body.content_type,
          size: body.size,
          upload_url: uploadUrl,
          download_url: 'https://minio.example/bug.png',
        });
        files.push(created);
        return HttpResponse.json(created, { status: 201 });
      }),
      mswHttp.put(uploadUrl, () => new HttpResponse(null, { status: 200 })),
    );

    renderWithProviders(
      <>
        <CreateTicketFileForm ticketId={ticketId} />
        <TicketFileList ticketId={ticketId} />
      </>,
    );

    expect(await screen.findByText('No attachments yet.')).toBeInTheDocument();

    const png = new File(['hello'], 'bug.png', { type: 'image/png' });
    await user.upload(screen.getByLabelText('Attachment'), png);
    await user.click(screen.getByRole('button', { name: 'Upload' }));

    expect(await screen.findByRole('link', { name: 'bug.png (5 bytes)' })).toBeInTheDocument();
  });

  it('shows the server error message', async () => {
    const user = userEvent.setup();
    server.use(
      mswHttp.post(filesUrl, () =>
        HttpResponse.json({ error: { message: 'ticket not found' } }, { status: 404 }),
      ),
    );

    renderWithProviders(<CreateTicketFileForm ticketId={ticketId} />);

    const png = new File(['hello'], 'bug.png', { type: 'image/png' });
    await user.upload(screen.getByLabelText('Attachment'), png);
    await user.click(screen.getByRole('button', { name: 'Upload' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('ticket not found');
  });
});
