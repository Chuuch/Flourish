import { useAuthStore } from '@/features/auth';
import { useCreateTask } from '../hooks/useCreateTask';
import { useForm } from 'react-hook-form';
import { canCreateTasks, createTaskSchema, type CreateTaskInput } from '../schemas/task.schema';
import { Alert, Button, TextField } from '@/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';

export function CreateTaskForm({ projectId }: { projectId: string }) {
  const role = useAuthStore((state) => state.role);
  const createTask = useCreateTask(projectId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: { title: '', notes: '', status: 'todo' },
  });

  if (!canCreateTasks(role)) {
    return null;
  }

  return (
    <form
      onSubmit={(event) =>
        void handleSubmit((input) => {
          createTask.mutate(input, {
            onSuccess: () => {
              reset();
            },
          });
        })(event)
      }
      noValidate
    >
      <TextField
        label="Title"
        autoComplete="off"
        error={errors.title?.message}
        {...register('title')}
      />

      <div>
        <label htmlFor="notes">Notes</label>
        <textarea id="notes" className="block rounded border px-2 py-1" {...register('notes')} />
        {errors.notes ? <p role="alert">{errors.notes.message}</p> : null}
      </div>

      <div>
        <label htmlFor="status">Status</label>
        <select id="status" className="block rounded border px-2 py-1" {...register('status')}>
          <option value="todo">Todo</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>
        {errors.status ? <p role="alert">{errors.status.message}</p> : null}

        {createTask.isError ? <Alert>{createTask.error.message}</Alert> : null}

        <Button type="submit" disabled={createTask.isPending}>
          Add task
        </Button>
      </div>
    </form>
  );
}
