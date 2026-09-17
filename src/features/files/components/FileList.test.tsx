import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { FileList } from './FileList';
import { screen } from '@testing-library/react';
import { makeFile } from '@/test/factories/file';

const projectId = '55555555-5555-5555-5555-555555555555';
const filesUrl = `${env.API_URL}/projects/${projectId}/files`;

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
});
