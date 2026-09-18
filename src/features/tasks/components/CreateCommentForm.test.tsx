import { env } from '@/config/env';
import { renderWithProviders } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { makeComment } from '@/test/factories/comment';
import { useAuthStore } from '@/features/auth';
import { MemoryRouter, Route, Routes } from 'react-router';
import { CreateCommentForm } from '@/features/comments/components/CreateCommentForm';
import { createCommentSchema, type Comment } from '@/features/comments/schemas/comment.schema';
import { CommentsPage } from '@/features/comments';

const clientId = '44444444-4444-4444-4444-444444444444';
const projectId = '55555555-5555-5555-5555-555555555555';
const taskId = '66666666-6666-6666-6666-666666666666';
const commentsUrl = `${env.API_URL}/tasks/${taskId}/comments`;

const testOrg = {
  id: crypto.randomUUID(),
  name: 'Acme',
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
};

function signInAs(role: 'owner' | 'admin' | 'member', userId = crypto.randomUUID()) {
  useAuthStore
    .getState()
    .setSession({ id: userId, email: 'ada@example.com' }, 'token', testOrg, role);
  return userId;
}

describe('CreateCommentForm', () => {
  it('shows the form for members', () => {
    signInAs('member');
    renderWithProviders(<CreateCommentForm taskId={taskId} />);

    expect(screen.getByRole('button', { name: 'Add comment' })).toBeInTheDocument();
  });

  it('shows a validation error without calling the API', async () => {
    const user = userEvent.setup();
    signInAs('member');
    renderWithProviders(<CreateCommentForm taskId={taskId} />);

    await user.click(screen.getByRole('button', { name: 'Add comment' }));

    expect(await screen.findByText('Body is required')).toBeInTheDocument();
  });

  it('creates a comment and refreshes the list', async () => {
    const user = userEvent.setup();
    const userId = signInAs('member');
    const comments: Comment[] = [];

    server.use(
      mswHttp.get(commentsUrl, () => HttpResponse.json(comments)),
      mswHttp.post(commentsUrl, async ({ request }) => {
        const input = createCommentSchema.parse(await request.json());
        const created = makeComment({
          task_id: taskId,
          user_id: userId,
          body: input.body,
        });
        comments.push(created);
        return HttpResponse.json(created, { status: 201 });
      }),
    );

    renderWithProviders(
      <MemoryRouter
        initialEntries={[`/clients/${clientId}/projects/${projectId}/tasks/${taskId}/comments`]}
      >
        <Routes>
          <Route
            path="/clients/:clientId/projects/:projectId/tasks/:taskId/comments"
            element={<CommentsPage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('No comments yet.')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Body'), 'Check the OAuth redirect');
    await user.click(screen.getByRole('button', { name: 'Add comment' }));

    expect(await screen.findByText(`${userId} - Check the OAuth redirect`)).toBeInTheDocument();
    expect(screen.getByLabelText('Body')).toHaveValue('');
  });

  it('shows the server error message', async () => {
    const user = userEvent.setup();
    signInAs('admin');
    server.use(
      mswHttp.post(commentsUrl, () =>
        HttpResponse.json({ error: { message: 'task not found' } }, { status: 404 }),
      ),
    );

    renderWithProviders(<CreateCommentForm taskId={taskId} />);

    await user.type(screen.getByLabelText('Body'), 'Check the OAuth redirect');
    await user.click(screen.getByRole('button', { name: 'Add comment' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('task not found');
  });
});
