import { env } from '@/config/env';
import { renderWithProviders } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CreateTimeEntryForm } from './CreateTimeEntryForm';
import { screen } from '@testing-library/react';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { createTimeEntrySchema, type TimeEntry } from '../schemas/time-entry.schema';
import { makeTimeEntry } from '@/test/factories/time-entry';
import { useAuthStore } from '@/features/auth';
import { MemoryRouter, Route, Routes } from 'react-router';
import { TimeEntriesPage } from '../pages/TimeEntriesPage';

const clientId = '44444444-4444-4444-4444-444444444444';
const projectId = '55555555-5555-5555-5555-555555555555';
const taskId = '66666666-6666-6666-6666-666666666666';
const timeEntriesUrl = `${env.API_URL}/tasks/${taskId}/time-entries`;

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

describe('CreateTimeEntryForm', () => {
  it('shows the form for members', () => {
    signInAs('member');
    renderWithProviders(<CreateTimeEntryForm taskId={taskId} />);

    expect(screen.getByRole('button', { name: 'Add time' })).toBeInTheDocument();
  });

  it('shows a validation error without calling the API', async () => {
    const user = userEvent.setup();
    signInAs('member');
    renderWithProviders(<CreateTimeEntryForm taskId={taskId} />);

    await user.click(screen.getByRole('button', { name: 'Add time' }));

    expect(await screen.findByText('Minutes must be at least 1')).toBeInTheDocument();
  });

  it('creates a time entry and refreshes the list', async () => {
    const user = userEvent.setup();
    signInAs('member');
    const entries: TimeEntry[] = [];

    server.use(
      mswHttp.get(timeEntriesUrl, () => HttpResponse.json(entries)),
      mswHttp.post(timeEntriesUrl, async ({ request }) => {
        const input = createTimeEntrySchema.parse(await request.json());
        const created = makeTimeEntry({
          task_id: taskId,
          minutes: input.minutes,
          notes: input.notes,
        });
        entries.push(created);
        return HttpResponse.json(created, { status: 201 });
      }),
    );

    renderWithProviders(
      <MemoryRouter
        initialEntries={[`/clients/${clientId}/projects/${projectId}/tasks/${taskId}/time-entries`]}
      >
        <Routes>
          <Route
            path="/clients/:clientId/projects/:projectId/tasks/:taskId/time-entries"
            element={<TimeEntriesPage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('No time entries yet.')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Minutes'), '90');
    await user.type(screen.getByLabelText('Notes'), 'OAuth');
    await user.click(screen.getByRole('button', { name: 'Add time' }));

    expect(await screen.findByText('90 min - OAuth')).toBeInTheDocument();
    expect(screen.getByLabelText('Minutes')).toHaveValue(0);
  });

  it('shows the server error message', async () => {
    const user = userEvent.setup();
    signInAs('admin');
    server.use(
      mswHttp.post(timeEntriesUrl, () =>
        HttpResponse.json({ error: { message: 'task not found' } }, { status: 404 }),
      ),
    );

    renderWithProviders(<CreateTimeEntryForm taskId={taskId} />);

    await user.type(screen.getByLabelText('Minutes'), '90');
    await user.click(screen.getByRole('button', { name: 'Add time' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('task not found');
  });
});
