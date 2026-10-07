import { useState } from 'react';
import { Alert, Button, SelectField } from '@/components/ui';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { useI18n } from '@/features/i18n';
import { useInbox } from '../hooks/useInbox';
import { useUpdateTask } from '../hooks/useUpdateTask';
import { taskStatusSchema, type Task, type TaskStatus } from '../schemas/task.schema';
import { EditTaskForm } from './EditTaskForm';

function statusLabel(
  status: TaskStatus,
  t: (key: 'tasks.todo' | 'tasks.inProgress' | 'tasks.done') => string,
): string {
  switch (status) {
    case 'in_progress':
      return t('tasks.inProgress');
    case 'done':
      return t('tasks.done');
    default:
      return t('tasks.todo');
  }
}

function InboxTaskDetail({ task, onBack }: { task: Task; onBack: () => void }) {
  const updateTask = useUpdateTask();
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-4">
      <div className="page-header">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="self-start px-0"
          onClick={onBack}
        >
          {t('inbox.back')}
        </Button>
        <h2 className="m-0 text-base font-semibold tracking-tight">{task.title}</h2>
        {task.notes ? <p className="text-muted m-0 text-sm leading-relaxed">{task.notes}</p> : null}
      </div>

      {updateTask.isError ? <Alert>{updateTask.error.message}</Alert> : null}

      <SelectField
        label={t('tasks.statusFor', { title: task.title })}
        value={task.status}
        disabled={updateTask.isPending}
        onChange={(event) => {
          const parsed = taskStatusSchema.safeParse(event.currentTarget.value);

          if (!parsed.success) {
            return;
          }

          const status: TaskStatus = parsed.data;
          updateTask.mutate({
            taskId: task.id,
            input: { status, version: task.version },
          });
        }}
      >
        <option value="todo">{t('tasks.todo')}</option>
        <option value="in_progress">{t('tasks.inProgress')}</option>
        <option value="done">{t('tasks.done')}</option>
      </SelectField>

      <EditTaskForm task={task} />
    </div>
  );
}

export function InboxList({ query = '' }: { query?: string }) {
  const { data, isPending, isError, error, refetch, isFetching } = useInbox(query);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const { t } = useI18n();

  if (isPending) {
    return <ListSkeleton label={t('inbox.loading')} />;
  }

  if (isError) {
    return (
      <Alert>
        <p>{t('inbox.loadError', { message: error.message })}</p>
        <Button type="button" variant="ghost" size="sm" onClick={() => void refetch()}>
          {t('common.retry')}
        </Button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return (
      <p className="text-muted m-0 text-sm">{query ? t('inbox.noMatches') : t('inbox.empty')}</p>
    );
  }

  const selectedTask = selectedTaskId
    ? (data.find((task) => task.id === selectedTaskId) ?? null)
    : null;

  if (selectedTask) {
    return (
      <InboxTaskDetail
        task={selectedTask}
        onBack={() => {
          setSelectedTaskId(null);
        }}
      />
    );
  }

  return (
    <ul className={isFetching ? 'stack-list opacity-70' : 'stack-list'}>
      {data.map((task) => (
        <li key={task.id} className="!p-0">
          <button
            type="button"
            className="hover:bg-canvas-elevated/60 flex w-full cursor-pointer items-start justify-between gap-3 px-[0.9rem] py-[0.75rem] text-left transition-colors duration-150 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
            onClick={() => {
              setSelectedTaskId(task.id);
            }}
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-ink">{task.title}</span>
              {task.notes ? (
                <span className="text-muted mt-0.5 block truncate text-xs leading-relaxed">
                  {task.notes}
                </span>
              ) : null}
            </span>
            <span className="text-muted shrink-0 text-xs font-medium tabular-nums">
              {statusLabel(task.status, t)}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
