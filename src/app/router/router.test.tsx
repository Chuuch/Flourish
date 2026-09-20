import { env } from '@/config/env';
import { renderWithProviders } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { makeFile } from '@/test/factories/file';
import { useAuthStore } from '@/features/auth';
import { MemoryRouter, Route, Routes } from 'react-router';
import { FilesPage, type ProjectFile } from '@/features/files';
import { CreateFileForm } from '@/features/files/components/CreateFileForm';

const clientId = '44444444-4444-4444-4444-444444444444';
const projectId = '55555555-5555-5555-5555-555555555555';
const filesUrl = `${env.API_URL}/projects/${projectId}/files`;
const uploadUrl = `${env.API_URL}/storage-put`;

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

describe('CreateFileForm', () => {
  it('hides the form for members', () => {
    signInAs('member');
    renderWithProviders(<CreateFileForm projectId={projectId} />);

    expect(screen.queryByRole('button', { name: 'Upload' })).not.toBeInTheDocument();
  });

  it('shows a validation error without calling the API', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    renderWithProviders(<CreateFileForm projectId={projectId} />);

    await user.click(screen.getByRole('button', { name: 'Upload' }));

    expect(await screen.findByText('File is required')).toBeInTheDocument();
  });

  it('uploads a file and refreshes the list', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    const files: ProjectFile[] = [];

    server.use(
      mswHttp.get(filesUrl, () => HttpResponse.json(files)),
      mswHttp.post(filesUrl, async ({ request }) => {
        const body = (await request.json()) as {
          filename: string;
          content_type: string;
          size: number;
        };
        const created = makeFile({
          project_id: projectId,
          filename: body.filename,
          content_type: body.content_type,
          size: body.size,
          upload_url: uploadUrl,
          download_url: 'https://minio.example/spec.pdf',
        });
        files.push(created);
        return HttpResponse.json(created, { status: 201 });
      }),
      mswHttp.put(uploadUrl, () => new HttpResponse(null, { status: 200 })),
    );

    renderWithProviders(
      <MemoryRouter initialEntries={[`/clients/${clientId}/projects/${projectId}/files`]}>
        <Routes>
          <Route path="/clients/:clientId/projects/:projectId/files" element={<FilesPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('No files yet.')).toBeInTheDocument();

    const pdf = new File(['hello'], 'spec.pdf', { type: 'application/pdf' });
    await user.upload(screen.getByLabelText('File'), pdf);
    await user.click(screen.getByRole('button', { name: 'Upload' }));

    expect(await screen.findByRole('link', { name: 'spec.pdf (5 bytes)' })).toBeInTheDocument();
  });

  it('shows the server error message', async () => {
    const user = userEvent.setup();
    signInAs('admin');
    server.use(
      mswHttp.post(filesUrl, () =>
        HttpResponse.json({ error: { message: 'project not found' } }, { status: 404 }),
      ),
    );

    renderWithProviders(<CreateFileForm projectId={projectId} />);

    const pdf = new File(['hello'], 'spec.pdf', { type: 'application/pdf' });
    await user.upload(screen.getByLabelText('File'), pdf);
    await user.click(screen.getByRole('button', { name: 'Upload' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('project not found');
  });
});
