import { useMembers } from '@/features/members';
import {
  assigneeIdOrNull,
  editTaskFormSchema,
  type EditTaskFormInput,
  type Task,
} from '../schemas/task.schema';
import { useUpdateTask } from '../hooks/useUpdateTask';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, TextField } from '@/components/ui';
import { AssigneeSelect } from './AssigneeSelect';
import { useI18n } from '@/features/i18n';

export function EditTaskForm({ task, projectId }: { task: Task; projectId?: string }) {
  const members = useMembers();
  const updateTask = useUpdateTask(projectId);
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditTaskFormInput>({
    resolver: zodResolver(editTaskFormSchema),
    defaultValues: {
      title: task.title,
      notes: task.notes,
      assignee_id: task.assignee_id ?? '',
    },
  });

  return (
    <form
      onSubmit={(event) =>
        void handleSubmit((input) => {
          updateTask.mutate({
            taskId: task.id,
            input: {
              title: input.title,
              notes: input.notes,
              status: task.status,
              assignee_id: assigneeIdOrNull(input.assignee_id),
              version: task.version,
            },
          });
        })(event)
      }
      noValidate
    >
      <TextField
        label={t('tasks.titleFor', { title: task.title })}
        autoComplete="off"
        error={errors.title?.message}
        {...register('title')}
      />

      <div>
        <label htmlFor={`notes-${task.id}`}>{t('tasks.notesFor', { title: task.title })}</label>
        <textarea
          id={`notes-${task.id}`}
          className="block rounded border px-2 py-1"
          {...register('notes')}
        />
        {errors.notes ? <p role="alert">{errors.notes.message}</p> : null}
      </div>

      <AssigneeSelect
        id={`assignee-${task.id}`}
        label={t('tasks.assigneeFor', { title: task.title })}
        members={members.data ?? []}
        error={errors.assignee_id?.message}
        registration={register('assignee_id')}
      />

      {updateTask.isError ? <Alert>{updateTask.error.message}</Alert> : null}

      <Button type="submit" disabled={updateTask.isPending}>
        {t('tasks.save', { title: task.title })}
      </Button>
    </form>
  );
}
