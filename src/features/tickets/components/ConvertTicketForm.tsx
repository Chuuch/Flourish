import { useAuthStore } from '@/features/auth';
import { useProjects } from '@/features/projects';
import { useConvertTicket } from '../hooks/useConvertTicket';
import { useState } from 'react';
import { canCreateTasks } from '@/features/tasks/schemas/task.schema';
import { Alert, Button, SelectField } from '@/components/ui';
import { Link } from 'react-router';
import { projectTasksPath } from '@/app/router/paths';
import { useI18n } from '@/features/i18n';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';

export function ConvertTicketForm({
  clientId,
  ticketId,
  ticketTitle,
}: {
  clientId: string;
  ticketId: string;
  ticketTitle: string;
}) {
  const role = useAuthStore((state) => state.role);
  const projects = useProjects(clientId);
  const convertTicket = useConvertTicket(clientId);
  const [projectId, setProjectId] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const { t } = useI18n();

  if (!canCreateTasks(role)) {
    return null;
  }

  if (projects.isPending) {
    return <ListSkeleton label={t('projects.loading')} />;
  }

  if (projects.isError) {
    return (
      <Alert>
        <p>{t('projects.loadError', { message: projects.error.message })}</p>
      </Alert>
    );
  }

  if (projects.data.length === 0) {
    return <p className="text-muted m-0 text-sm">{t('projects.empty')}</p>;
  }

  const created = convertTicket.data;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!projectId) {
          setValidationError(t('validation.projectRequired'));
          return;
        }
        setValidationError(null);
        convertTicket.mutate({ ticketId, projectId });
      }}
      noValidate
    >
      <SelectField
        id={`convert-project-${ticketId}`}
        label={t('tickets.convertOn', { title: ticketTitle })}
        value={projectId}
        onChange={(event) => {
          setProjectId(event.currentTarget.value);
        }}
        error={validationError ?? undefined}
      >
        <option value="">{t('tickets.selectProject')}</option>
        {projects.data.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </SelectField>

      {convertTicket.isError ? <Alert>{convertTicket.error.message}</Alert> : null}

      <div className="form-actions">
        <Button type="submit" disabled={convertTicket.isPending}>
          {t('tickets.convert')}
        </Button>
      </div>

      {created ? (
        <p className="text-muted m-0 text-sm">
          <Link to={projectTasksPath(clientId, created.project_id)}>
            {t('tickets.openedAs', { title: created.title })}
          </Link>
        </p>
      ) : null}
    </form>
  );
}
