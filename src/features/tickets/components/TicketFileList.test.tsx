import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { TicketFileList } from './TicketFileList';
import { screen } from '@testing-library/react';
import { makeTicketFile } from '@/test/factories/ticket-file';
import { useAuthStore } from '@/features/auth';
import userEvent from '@testing-library/user-event';
import type { TicketFile } from '../schemas/ticket-file.schema';

const ticketId = '99999999-9999-9999-9999-999999999999';
const portalFilesUrl = `${env.API_URL}/client-auth/tickets/${ticketId}/files`;
const staffFilesUrl = `${env.API_URL}/tickets/${ticketId}/files`;
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

describe('TicketFileList', () => {
  it('renders files returned by the API', async () => {
    const screenshot = makeTicketFile({
      ticket_id: ticketId,
      filename: 'bug.png',
      size: 2048,
      download_url: 'https://minio.example/bug.png',
    });

    server.use(
      mswHttp.get(portalFilesUrl, () =>
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
    server.use(mswHttp.get(portalFilesUrl, () => HttpResponse.json([])));
    renderWithProviders(<TicketFileList ticketId={ticketId} />);

    expect(await screen.findByText('No attachments yet.')).toBeInTheDocument();
  });

  it('renders the API error response', async () => {
    server.use(
      mswHttp.get(portalFilesUrl, () =>
        HttpResponse.json({ error: { message: 'ticket not found' } }, { status: 404 }),
      ),
    );

    renderWithProviders(<TicketFileList ticketId={ticketId} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('ticket not found');
  });

  it('hides remove on files another portal user uploaded', async () => {
    signInPortal();
    server.use(
      mswHttp.get(portalFilesUrl, () =>
        HttpResponse.json([
          makeTicketFile({
            uploaded_by: actorUserId,
            filename: 'notes.txt',
            size: 12,
          }),
          makeTicketFile({
            uploaded_by: crypto.randomUUID(),
            filename: 'bug.png',
            size: 2048,
            download_url: 'https://minio.example/bug.png',
          }),
        ]),
      ),
    );

    renderWithProviders(<TicketFileList ticketId={ticketId} />);

    expect(
      await screen.findByRole('button', { name: 'Remove notes.txt (12 bytes)' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Remove bug.png (2048 bytes)' }),
    ).not.toBeInTheDocument();
  });

  it('removes a portal file', async () => {
    const user = userEvent.setup();
    signInPortal();
    const file = makeTicketFile({
      uploaded_by: actorUserId,
      filename: 'bug.png',
      size: 2048,
      download_url: 'https://minio.example/bug.png',
    });
    let files: TicketFile[] = [file];

    server.use(
      mswHttp.get(portalFilesUrl, () => HttpResponse.json(files)),
      mswHttp.delete(`${env.API_URL}/client-auth/ticket-files/${file.id}`, () => {
        files = [];
        return new HttpResponse(null, { status: 204 });
      }),
    );

    renderWithProviders(<TicketFileList ticketId={ticketId} />);

    await user.click(await screen.findByRole('button', { name: 'Remove bug.png (2048 bytes)' }));

    expect(await screen.findByText('No attachments yet.')).toBeInTheDocument();
  });

  it('hides remove on files another staff member uploaded', async () => {
    signInAs('member');
    server.use(
      mswHttp.get(staffFilesUrl, () =>
        HttpResponse.json([
          makeTicketFile({
            uploaded_by: actorUserId,
            filename: 'notes.txt',
            size: 12,
          }),
          makeTicketFile({
            uploaded_by: crypto.randomUUID(),
            filename: 'bug.png',
            size: 2048,
          }),
        ]),
      ),
    );

    renderWithProviders(<TicketFileList ticketId={ticketId} source="staff" />);

    expect(
      await screen.findByRole('button', { name: 'Remove notes.txt (12 bytes)' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Remove bug.png (2048 bytes)' }),
    ).not.toBeInTheDocument();
  });

  it('removes a staff file', async () => {
    const user = userEvent.setup();
    signInAs('admin');
    const file = makeTicketFile({
      filename: 'bug.png',
      size: 2048,
      download_url: 'https://minio.example/bug.png',
    });
    let files: TicketFile[] = [file];

    server.use(
      mswHttp.get(staffFilesUrl, () => HttpResponse.json(files)),
      mswHttp.delete(`${env.API_URL}/ticket-files/${file.id}`, () => {
        files = [];
        return new HttpResponse(null, { status: 204 });
      }),
    );

    renderWithProviders(<TicketFileList ticketId={ticketId} source="staff" />);

    await user.click(await screen.findByRole('button', { name: 'Remove bug.png (2048 bytes)' }));

    expect(await screen.findByText('No attachments yet.')).toBeInTheDocument();
  });

  it('shows a forbidden error from the API', async () => {
    const user = userEvent.setup();
    signInPortal();
    const file = makeTicketFile({
      uploaded_by: actorUserId,
      filename: 'notes.txt',
      size: 12,
    });

    server.use(
      mswHttp.get(portalFilesUrl, () => HttpResponse.json([file])),
      mswHttp.delete(`${env.API_URL}/client-auth/ticket-files/${file.id}`, () =>
        HttpResponse.json({ error: { code: 'forbidden', message: 'forbidden' } }, { status: 403 }),
      ),
    );

    renderWithProviders(<TicketFileList ticketId={ticketId} />);

    await user.click(await screen.findByRole('button', { name: 'Remove notes.txt (12 bytes)' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('forbidden');
  });

  it('shows a not-found error from the API', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    const file = makeTicketFile({
      filename: 'bug.png',
      size: 2048,
      download_url: 'https://minio.example/bug.png',
    });

    server.use(
      mswHttp.get(staffFilesUrl, () => HttpResponse.json([file])),
      mswHttp.delete(`${env.API_URL}/ticket-files/${file.id}`, () =>
        HttpResponse.json(
          { error: { code: 'file_not_found', message: 'file not found' } },
          { status: 404 },
        ),
      ),
    );

    renderWithProviders(<TicketFileList ticketId={ticketId} source="staff" />);

    await user.click(await screen.findByRole('button', { name: 'Remove bug.png (2048 bytes)' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('file not found');
  });
});
