import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { TimeEntryList } from './TimeEntryList';
import { screen } from '@testing-library/react';
import { makeTimeEntry } from '@/test/factories/time-entry';

const taskId = '66666666-6666-6666-6666-666666666666';
const timeEntriesUrl = `${env.API_URL}/tasks/${taskId}/time-entries`;

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
});
