import { env } from '@/config/env';
import { renderWithProviders } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ConvertTicketForm } from './ConvertTicketForm';
import { screen } from '@testing-library/react';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { useAuthStore } from '@/features/auth';
import { MemoryRouter } from 'react-router';
import { makeProject } from '@/test/factories/project';
import { makeTask } from '@/test/factories/task';
import { convertTicketSchema } from '../schemas/ticket.schema';

const clientId = '44444444-4444-4444-4444-444444444444';
const ticketId = '99999999-9999-9999-9999-999999999999';
const projectsUrl = `${env.API_URL}/clients/${clientId}/projects`;
const convertUrl = `${env.API_URL}/tickets/${ticketId}/convert`;

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

describe('ConvertTicketForm', () => {
  it('hides the form for members', () => {
    signInAs('member');
    renderWithProviders(
      <MemoryRouter>
        <ConvertTicketForm
          clientId={clientId}
          ticketId={ticketId}
          ticketTitle="Login button broken"
        />
      </MemoryRouter>,
    );

    expect(screen.queryByRole('button', { name: 'Convert to task' })).not.toBeInTheDocument();
  });

  it('shows a validation error without calling the API', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    const website = makeProject({ client_id: clientId, name: 'Website' });

    server.use(mswHttp.get(projectsUrl, () => HttpResponse.json([website])));

    renderWithProviders(
      <MemoryRouter>
        <ConvertTicketForm
          clientId={clientId}
          ticketId={ticketId}
          ticketTitle="Login button broken"
        />
      </MemoryRouter>,
    );

    expect(await screen.findByLabelText('Convert Login button broken on')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Convert to task' }));

    expect(await screen.findByText('Project is required')).toBeInTheDocument();
  });

  it('converts a ticket and links to the project tasks', async () => {
    const user = userEvent.setup();
    signInAs('admin');
    const website = makeProject({ client_id: clientId, name: 'Website' });

    server.use(
      mswHttp.get(projectsUrl, () => HttpResponse.json([website])),
      mswHttp.post(convertUrl, async ({ request }) => {
        const input = convertTicketSchema.parse(await request.json());
        expect(input.project_id).toBe(website.id);
        return HttpResponse.json(
          makeTask({
            project_id: website.id,
            ticket_id: ticketId,
            title: 'Login button broken',
            notes: 'Clicking Sign in does nothing on mobile.',
            status: 'todo',
          }),
          { status: 201 },
        );
      }),
    );

    renderWithProviders(
      <MemoryRouter>
        <ConvertTicketForm
          clientId={clientId}
          ticketId={ticketId}
          ticketTitle="Login button broken"
        />
      </MemoryRouter>,
    );

    await user.selectOptions(
      await screen.findByLabelText('Convert Login button broken on'),
      website.id,
    );
    await user.click(screen.getByRole('button', { name: 'Convert to task' }));

    expect(
      await screen.findByRole('link', { name: 'Opened as Login button broken' }),
    ).toHaveAttribute('href', `/clients/${clientId}/projects/${website.id}/tasks`);
  });

  it('shows the server error message', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    const website = makeProject({ client_id: clientId, name: 'Website' });

    server.use(
      mswHttp.get(projectsUrl, () => HttpResponse.json([website])),
      mswHttp.post(convertUrl, () =>
        HttpResponse.json({ error: { message: 'ticket already converted' } }, { status: 409 }),
      ),
    );

    renderWithProviders(
      <MemoryRouter>
        <ConvertTicketForm
          clientId={clientId}
          ticketId={ticketId}
          ticketTitle="Login button broken"
        />
      </MemoryRouter>,
    );

    await user.selectOptions(
      await screen.findByLabelText('Convert Login button broken on'),
      website.id,
    );
    await user.click(screen.getByRole('button', { name: 'Convert to task' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('ticket already converted');
  });
});
