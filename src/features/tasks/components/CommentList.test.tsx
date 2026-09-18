import { env } from '@/config/env';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { renderWithProviders } from '@/test/render';
import { screen } from '@testing-library/react';
import { makeComment } from '@/test/factories/comment';
import { useAuthStore } from '@/features/auth';
import userEvent from '@testing-library/user-event';
import { CommentList } from '@/features/comments/components/CommentList';
import { updateCommentSchema, type Comment } from '@/features/comments/schemas/comment.schema';

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

describe('CommentList', () => {
  it('renders comments returned by the API', async () => {
    const authorId = crypto.randomUUID();
    signInAs('member', authorId);
    const comment = makeComment({
      task_id: taskId,
      user_id: authorId,
      body: 'Check the OAuth redirect',
    });

    server.use(mswHttp.get(commentsUrl, () => HttpResponse.json([comment])));

    renderWithProviders(<CommentList taskId={taskId} />);

    expect(await screen.findByText(`${authorId} - Check the OAuth redirect`)).toBeInTheDocument();
  });

  it('renders an empty state', async () => {
    signInAs('member');
    server.use(mswHttp.get(commentsUrl, () => HttpResponse.json([])));
    renderWithProviders(<CommentList taskId={taskId} />);

    expect(await screen.findByText('No comments yet.')).toBeInTheDocument();
  });

  it('renders the API error response', async () => {
    signInAs('member');
    server.use(
      mswHttp.get(commentsUrl, () =>
        HttpResponse.json({ error: { message: 'Database unavailable' } }, { status: 503 }),
      ),
    );

    renderWithProviders(<CommentList taskId={taskId} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Database unavailable');
  });

  it('lets the author edit a comment', async () => {
    const user = userEvent.setup();
    const authorId = crypto.randomUUID();
    signInAs('member', authorId);
    const comment = makeComment({
      task_id: taskId,
      user_id: authorId,
      body: 'First draft',
    });
    let current: Comment = comment;

    server.use(
      mswHttp.get(commentsUrl, () => HttpResponse.json([current])),
      mswHttp.patch(`${env.API_URL}/comments/${comment.id}`, async ({ request }) => {
        const input = updateCommentSchema.parse(await request.json());
        current = { ...current, body: input.body };
        return HttpResponse.json(current);
      }),
    );

    renderWithProviders(<CommentList taskId={taskId} />);

    await user.click(await screen.findByRole('button', { name: 'Edit' }));
    await user.clear(screen.getByLabelText('Edit body'));
    await user.type(screen.getByLabelText('Edit body'), 'Fixed draft');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText(`${authorId} - Fixed draft`)).toBeInTheDocument();
  });

  it('hides edit and delete for another member', async () => {
    signInAs('member');
    server.use(
      mswHttp.get(commentsUrl, () =>
        HttpResponse.json([makeComment({ task_id: taskId, body: 'Check the OAuth redirect' })]),
      ),
    );

    renderWithProviders(<CommentList taskId={taskId} />);

    expect(await screen.findByText(/Check the OAuth redirect/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });

  it('lets an admin delete another member comment', async () => {
    const user = userEvent.setup();
    signInAs('admin');
    const comment = makeComment({ task_id: taskId, body: 'Remove me' });
    let comments: Comment[] = [comment];

    server.use(
      mswHttp.get(commentsUrl, () => HttpResponse.json(comments)),
      mswHttp.delete(`${env.API_URL}/comments/${comment.id}`, () => {
        comments = [];
        return new HttpResponse(null, { status: 204 });
      }),
    );

    renderWithProviders(<CommentList taskId={taskId} />);

    await user.click(await screen.findByRole('button', { name: 'Delete' }));

    expect(await screen.findByText('No comments yet.')).toBeInTheDocument();
  });
});
