import { env } from '@/config/env';
import { renderWithProviders } from '@/test/render';
import { server } from '@/test/server';
import { makeMember } from '@/test/factories/member';
import { makeTask } from '@/test/factories/task';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http as mswHttp } from 'msw';
import { describe, expect, it } from 'vitest';
import { updateTaskSchema } from '../schemas/task.schema';
import { EditTaskForm } from './EditTaskForm';

const membersUrl = `${env.API_URL}/members`;

describe('EditTaskForm', () => {
  it('saves title, notes, and assignee', async () => {
    const user = userEvent.setup();
    const member = makeMember({ email: 'ben@example.com' });
    const task = makeTask({ title: 'Fix login', notes: 'OAuth', version: 1 });

    server.use(
      mswHttp.get(membersUrl, () => HttpResponse.json([member])),
      mswHttp.patch(`${env.API_URL}/tasks/${task.id}`, async ({ request }) => {
        const input = updateTaskSchema.parse(await request.json());
        expect(input.title).toBe('Ship site');
        expect(input.notes).toBe('New notes');
        expect(input.assignee_id).toBe(member.user_id);
        expect(input.status).toBe('todo');
        expect(input.version).toBe(1);
        return HttpResponse.json({
          ...task,
          title: input.title,
          notes: input.notes,
          assignee_id: input.assignee_id,
          version: 2,
        });
      }),
    );

    renderWithProviders(<EditTaskForm task={task} />);

    await user.clear(await screen.findByLabelText('Title for Fix login'));
    await user.type(screen.getByLabelText('Title for Fix login'), 'Ship site');
    await user.clear(screen.getByLabelText('Notes for Fix login'));
    await user.type(screen.getByLabelText('Notes for Fix login'), 'New notes');
    await user.selectOptions(screen.getByLabelText('Assignee for Fix login'), member.user_id);
    await user.click(screen.getByRole('button', { name: 'Save Fix login' }));

    expect(await screen.findByLabelText('Title for Fix login')).toHaveValue('Ship site');
  });
});
