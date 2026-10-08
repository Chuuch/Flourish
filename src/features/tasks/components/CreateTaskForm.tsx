import { useAuthStore } from '@/features/auth';
import { useCreateTask } from '../hooks/useCreateTask';
import { useForm } from 'react-hook-form';
import {
  assigneeIdOrNull,
  canCreateTasks,
  createTaskFormSchema,
  type CreateTaskFormInput,
} from '../schemas/task.schema';
import { Alert, Button, FieldGrid, SelectField, TextArea, TextField } from '@/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMembers } from '@/features/members';
import { AssigneeSelect } from './AssigneeSelect';
import { useI18n } from '@/features/i18n';

type CreateTaskFormProps = {
  projectId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function CreateTaskForm({ projectId, onSuccess, onCancel }: CreateTaskFormProps) {
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
                onSuccess?.();
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
      <TextArea label={t('tasks.notes')} error={errors.notes?.message} {...register('notes')} />

      <FieldGrid>
        <AssigneeSelect
          id="assignee_id"
          label={t('tasks.assignee')}
          members={members.data ?? []}
          error={errors.assignee_id?.message}
          registration={register('assignee_id')}
        />
        <SelectField
          label={t('tasks.status')}
          error={errors.status?.message}
          {...register('status')}
        >
          <option value="todo">{t('tasks.todo')}</option>
          <option value="in_progress">{t('tasks.inProgress')}</option>
          <option value="done">{t('tasks.done')}</option>
        </SelectField>
      </FieldGrid>

      {createTask.isError ? <Alert>{createTask.error.message}</Alert> : null}

      <div className="form-actions">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        ) : null}
        <Button type="submit" disabled={createTask.isPending}>
          {t('tasks.add')}
        </Button>
      </div>
    </form>
  );
}
