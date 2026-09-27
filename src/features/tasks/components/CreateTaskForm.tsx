import { useAuthStore } from '@/features/auth';
import { useCreateTask } from '../hooks/useCreateTask';
import { useForm } from 'react-hook-form';
import {
  assigneeIdOrNull,
  canCreateTasks,
  createTaskFormSchema,
  type CreateTaskFormInput,
} from '../schemas/task.schema';
import { Alert, Button, TextField } from '@/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMembers } from '@/features/members';
import { AssigneeSelect } from './AssigneeSelect';
import { useI18n } from '@/features/i18n';

export function CreateTaskForm({ projectId }: { projectId: string }) {
  const role = useAuthStore((state) => state.role);
  const createTask = useCreateTask(projectId);
  const members = useMembers();
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFormInput>({
    resolver: zodResolver(createTaskFormSchema),
    defaultValues: { title: '', notes: '', status: 'todo', assignee_id: '' },
  });

  if (!canCreateTasks(role)) {
    return null;
  }

  return (
    <form
      onSubmit={(event) =>
        void handleSubmit((input) => {
          createTask.mutate(
            {
              title: input.title,
              notes: input.notes,
              status: input.status,
              assignee_id: assigneeIdOrNull(input.assignee_id),
            },
            {
              onSuccess: () => {
                reset();
              },
            },
          );
        })(event)
      }
      noValidate
    >
      <TextField
        label={t('tasks.titleLabel')}
        autoComplete="off"
        error={errors.title?.message}
        {...register('title')}
      />

      <div>
        <label htmlFor="notes">{t('tasks.notes')}</label>
        <textarea id="notes" className="block rounded border px-2 py-1" {...register('notes')} />
        {errors.notes ? <p role="alert">{errors.notes.message}</p> : null}
      </div>

      <AssigneeSelect
        id="assignee_id"
        label={t('tasks.assignee')}
        members={members.data ?? []}
        error={errors.assignee_id?.message}
        registration={register('assignee_id')}
      />

      <div>
        <label htmlFor="status">{t('tasks.status')}</label>
        <select id="status" className="block rounded border px-2 py-1" {...register('status')}>
          <option value="todo">{t('tasks.todo')}</option>
          <option value="in_progress">{t('tasks.inProgress')}</option>
          <option value="done">{t('tasks.done')}</option>
        </select>
        {errors.status ? <p role="alert">{errors.status.message}</p> : null}

        {createTask.isError ? <Alert>{createTask.error.message}</Alert> : null}

        <Button type="submit" disabled={createTask.isPending}>
          {t('tasks.add')}
        </Button>
      </div>
    </form>
  );
}
