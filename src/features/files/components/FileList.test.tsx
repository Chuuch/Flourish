import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { FileList } from './FileList';
import { screen } from '@testing-library/react';
import { makeFile } from '@/test/factories/file';
import { useAuthStore } from '@/features/auth';
import userEvent from '@testing-library/user-event';
import type { ProjectFile } from '../schemas/file.schema';

const projectId = '55555555-5555-5555-5555-555555555555';
const filesUrl = `${env.API_URL}/projects/${projectId}/files`;
const actorUserId = '11111111-1111-1111-1111-111111111111';

const testOrg = {
  id: crypto.randomUUID(),
  name: 'Acme',
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
};

function signInAs(role: 'owner' | 'admin' | 'member', userId = actorUserId) {
  useAuthStore
    .getState()
    .setSession({ id: userId, email: 'ada@example.com' }, 'token', testOrg, role);
}

describe('FileList', () => {
  it('renders files returned by the API', async () => {
    const spec = makeFile({
      filename: 'spec.pdf',
      size: 2048,
      download_url: 'https://minio.example/spec.pdf',
    });

    server.use(
      mswHttp.get(filesUrl, () =>
        HttpResponse.json([spec, makeFile({ filename: 'notes.txt', size: 12 })]),
      ),
    );

    renderWithProviders(<FileList projectId={projectId} />);

    expect(await screen.findByRole('link', { name: 'spec.pdf (2048 bytes)' })).toHaveAttribute(
      'href',
      spec.download_url,
    );
    expect(screen.getByText('notes.txt (12 bytes)')).toBeInTheDocument();
  });

  it('renders an empty state', async () => {
    server.use(mswHttp.get(filesUrl, () => HttpResponse.json([])));
    renderWithProviders(<FileList projectId={projectId} />);

    expect(await screen.findByText('No files yet.')).toBeInTheDocument();
  });

  it('renders the API error response', async () => {
    server.use(
      mswHttp.get(filesUrl, () =>
        HttpResponse.json({ error: { message: 'Database unavailable' } }, { status: 503 }),
      ),
    );

    renderWithProviders(<FileList projectId={projectId} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Database unavailable');
  });

  it('hides remove on files another member uploaded', async () => {
    signInAs('member');
    server.use(
      mswHttp.get(filesUrl, () =>
        HttpResponse.json([
          makeFile({
            uploaded_by: actorUserId,
            filename: 'notes.txt',
            size: 12,
          }),
          makeFile({
            uploaded_by: crypto.randomUUID(),
            filename: 'spec.pdf',
            size: 2048,
            download_url: 'https://minio.example/spec.pdf',
          }),
        ]),
      ),
    );

    renderWithProviders(<FileList projectId={projectId} />);

    expect(
      await screen.findByRole('button', { name: 'Remove notes.txt (12 bytes)' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Remove spec.pdf (2048 bytes)' }),
    ).not.toBeInTheDocument();
  });

  it('removes a file', async () => {
    const user = userEvent.setup();
    signInAs('admin');
    const file = makeFile({
      filename: 'spec.pdf',
      size: 2048,
      download_url: 'https://minio.example/spec.pdf',
    });
    let files: ProjectFile[] = [file];

    server.use(
      mswHttp.get(filesUrl, () => HttpResponse.json(files)),
      mswHttp.delete(`${env.API_URL}/files/${file.id}`, () => {
        files = [];
        return new HttpResponse(null, { status: 204 });
      }),
    );

    renderWithProviders(<FileList projectId={projectId} />);

    await user.click(await screen.findByRole('button', { name: 'Remove spec.pdf (2048 bytes)' }));

    expect(await screen.findByText('No files yet.')).toBeInTheDocument();
  });

  it('shows a forbidden error from the API', async () => {
    const user = userEvent.setup();
    signInAs('member');
    const file = makeFile({
      uploaded_by: actorUserId,
      filename: 'notes.txt',
      size: 12,
    });

    server.use(
      mswHttp.get(filesUrl, () => HttpResponse.json([file])),
      mswHttp.delete(`${env.API_URL}/files/${file.id}`, () =>
        HttpResponse.json({ error: { code: 'forbidden', message: 'forbidden' } }, { status: 403 }),
      ),
    );

    renderWithProviders(<FileList projectId={projectId} />);

    await user.click(await screen.findByRole('button', { name: 'Remove notes.txt (12 bytes)' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('forbidden');
  });

  it('shows a not-found error from the API', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    const file = makeFile({
      filename: 'spec.pdf',
      size: 2048,
      download_url: 'https://minio.example/spec.pdf',
    });

    server.use(
      mswHttp.get(filesUrl, () => HttpResponse.json([file])),
      mswHttp.delete(`${env.API_URL}/files/${file.id}`, () =>
        HttpResponse.json(
          { error: { code: 'file_not_found', message: 'file not found' } },
          { status: 404 },
        ),
      ),
    );

    renderWithProviders(<FileList projectId={projectId} />);

    await user.click(await screen.findByRole('button', { name: 'Remove spec.pdf (2048 bytes)' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('file not found');
  });
});
