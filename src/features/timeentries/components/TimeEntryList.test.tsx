import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { TimeEntryList } from './TimeEntryList';
import { screen } from '@testing-library/react';
import { makeTimeEntry } from '@/test/factories/time-entry';
import { useAuthStore } from '@/features/auth';
import userEvent from '@testing-library/user-event';
import { updateTimeEntrySchema, type TimeEntry } from '../schemas/time-entry.schema';

const taskId = '66666666-6666-6666-6666-666666666666';
const timeEntriesUrl = `${env.API_URL}/tasks/${taskId}/time-entries`;
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

describe('TimeEntryList', () => {
  it('renders time entries returned by the API', async () => {
    server.use(
      mswHttp.get(timeEntriesUrl, () =>
        HttpResponse.json([
          makeTimeEntry({ minutes: 90, notes: 'OAuth' }),
          makeTimeEntry({ minutes: 30, notes: '' }),
        ]),
      ),
    );

    renderWithProviders(<TimeEntryList taskId={taskId} />);

    expect(await screen.findByText('90 min - OAuth')).toBeInTheDocument();
    expect(screen.getByText('30 min')).toBeInTheDocument();
  });

  it('renders an empty state', async () => {
    server.use(mswHttp.get(timeEntriesUrl, () => HttpResponse.json([])));
    renderWithProviders(<TimeEntryList taskId={taskId} />);

    expect(await screen.findByText('No time entries yet.')).toBeInTheDocument();
  });

  it('renders the API error response', async () => {
    server.use(
      mswHttp.get(timeEntriesUrl, () =>
        HttpResponse.json({ error: { message: 'Database unavailable' } }, { status: 503 }),
      ),
    );

    renderWithProviders(<TimeEntryList taskId={taskId} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Database unavailable');
  });

  it('hides manage controls on other members entries', async () => {
    signInAs('member');
    server.use(
      mswHttp.get(timeEntriesUrl, () =>
        HttpResponse.json([
          makeTimeEntry({
            user_id: actorUserId,
            minutes: 90,
            notes: 'OAuth',
          }),
          makeTimeEntry({
            user_id: crypto.randomUUID(),
            minutes: 30,
            notes: '',
          }),
        ]),
      ),
    );

    renderWithProviders(<TimeEntryList taskId={taskId} />);

    expect(await screen.findByLabelText('Minutes for 90 min - OAuth')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove 90 min - OAuth' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Minutes for 30 min')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Remove 30 min' })).not.toBeInTheDocument();
  });

  it('updates a time entry', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    let entry: TimeEntry = makeTimeEntry({
      user_id: crypto.randomUUID(),
      minutes: 90,
      notes: 'OAuth',
    });

    server.use(
      mswHttp.get(timeEntriesUrl, () => HttpResponse.json([entry])),
      mswHttp.patch(`${env.API_URL}/time-entries/${entry.id}`, async ({ request }) => {
        const input = updateTimeEntrySchema.parse(await request.json());
        entry = { ...entry, minutes: input.minutes, notes: input.notes };
        return HttpResponse.json(entry);
      }),
    );

    renderWithProviders(<TimeEntryList taskId={taskId} />);

    expect(await screen.findByLabelText('Minutes for 90 min - OAuth')).toHaveValue(90);

    await user.clear(screen.getByLabelText('Minutes for 90 min - OAuth'));
    await user.type(screen.getByLabelText('Minutes for 90 min - OAuth'), '45');
    await user.clear(screen.getByLabelText('Notes for 90 min - OAuth'));
    await user.type(screen.getByLabelText('Notes for 90 min - OAuth'), 'SSO');
    await user.click(screen.getByRole('button', { name: 'Save 90 min - OAuth' }));

    expect(await screen.findByText('45 min - SSO')).toBeInTheDocument();
  });

  it('removes a time entry', async () => {
    const user = userEvent.setup();
    signInAs('admin');
    const entry = makeTimeEntry({ minutes: 90, notes: 'OAuth' });
    let entries: TimeEntry[] = [entry];

    server.use(
      mswHttp.get(timeEntriesUrl, () => HttpResponse.json(entries)),
      mswHttp.delete(`${env.API_URL}/time-entries/${entry.id}`, () => {
        entries = [];
        return new HttpResponse(null, { status: 204 });
      }),
    );

    renderWithProviders(<TimeEntryList taskId={taskId} />);

    await user.click(await screen.findByRole('button', { name: 'Remove 90 min - OAuth' }));

    expect(await screen.findByText('No time entries yet.')).toBeInTheDocument();
  });

  it('shows a forbidden error from the API', async () => {
    const user = userEvent.setup();
    signInAs('member');
    const entry = makeTimeEntry({
      user_id: actorUserId,
      minutes: 90,
      notes: 'OAuth',
    });

    server.use(
      mswHttp.get(timeEntriesUrl, () => HttpResponse.json([entry])),
      mswHttp.patch(`${env.API_URL}/time-entries/${entry.id}`, () =>
        HttpResponse.json({ error: { code: 'forbidden', message: 'forbidden' } }, { status: 403 }),
      ),
    );

    renderWithProviders(<TimeEntryList taskId={taskId} />);

    await user.clear(await screen.findByLabelText('Minutes for 90 min - OAuth'));
    await user.type(screen.getByLabelText('Minutes for 90 min - OAuth'), '15');
    await user.click(screen.getByRole('button', { name: 'Save 90 min - OAuth' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('forbidden');
  });

  it('shows a not-found error from the API', async () => {
    const user = userEvent.setup();
    signInAs('owner');
    const entry = makeTimeEntry({ minutes: 90, notes: 'OAuth' });

    server.use(
      mswHttp.get(timeEntriesUrl, () => HttpResponse.json([entry])),
      mswHttp.delete(`${env.API_URL}/time-entries/${entry.id}`, () =>
        HttpResponse.json(
          { error: { code: 'time_entry_not_found', message: 'time entry not found' } },
          { status: 404 },
        ),
      ),
    );

    renderWithProviders(<TimeEntryList taskId={taskId} />);

    await user.click(await screen.findByRole('button', { name: 'Remove 90 min - OAuth' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('time entry not found');
  });
});
