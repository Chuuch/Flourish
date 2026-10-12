import { clientProjectsPath, taskPath } from '@/app/router/paths';
import { Alert, Button, FieldGrid, SelectField, TextField } from '@/components/ui';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { useAuthStore } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { useMembers } from '@/features/members';
import { memberLabel } from '@/features/members/schemas/member.schema';
import { usePhases } from '@/features/phases';
import { useProjects } from '@/features/projects';
import {
  assigneeIdOrNull,
  canCreateTasks,
  dateOnOrNull,
  phaseIdOrNull,
} from '@/features/tasks/schemas/task.schema';
import { useState } from 'react';
import { Link } from 'react-router';
import { useConvertTicket } from '../hooks/useConvertTicket';

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
  const userId = useAuthStore((state) => state.user?.id);
  const projects = useProjects(clientId);
  const members = useMembers();
  const convertTicket = useConvertTicket(clientId);
  const [projectId, setProjectId] = useState('');
  const [assigneeId, setAssigneeId] = useState(userId ?? '');
  const [phaseId, setPhaseId] = useState('');
  const [startsOn, setStartsOn] = useState('');
  const [dueOn, setDueOn] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const phases = usePhases(projectId);
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

  const projectItems = projects.data.pages.flatMap((page) => page.items);

  if (projectItems.length === 0) {
    return (
      <p className="text-muted m-0 text-sm">
        {t('tickets.convertNoProjects')}{' '}
        <Link to={clientProjectsPath(clientId)}>{t('tickets.createProjectCta')}</Link>
      </p>
    );
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
        convertTicket.mutate({
          ticketId,
          input: {
            project_id: projectId,
            assignee_id: assigneeIdOrNull(assigneeId),
            phase_id: phaseIdOrNull(phaseId),
            starts_on: dateOnOrNull(startsOn),
            due_on: dateOnOrNull(dueOn),
          },
        });
      }}
      noValidate
    >
      <SelectField
        id={`convert-project-${ticketId}`}
        label={t('tickets.convertOn', { title: ticketTitle })}
        value={projectId}
        onChange={(event) => {
          setProjectId(event.currentTarget.value);
          setPhaseId('');
        }}
        error={validationError ?? undefined}
      >
        <option value="">{t('tickets.selectProject')}</option>
        {projectItems.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </SelectField>

      <FieldGrid>
        <SelectField
          id={`convert-assignee-${ticketId}`}
          label={t('tasks.assignee')}
          value={assigneeId}
          onChange={(event) => {
            setAssigneeId(event.currentTarget.value);
          }}
        >
          <option value="">{t('tasks.unassigned')}</option>
          {(members.data ?? []).map((member) => (
            <option key={member.user_id} value={member.user_id}>
              {memberLabel(member)}
            </option>
          ))}
        </SelectField>
        {projectId ? (
          <SelectField
            id={`convert-phase-${ticketId}`}
            label={t('tasks.phase')}
            value={phaseId}
            onChange={(event) => {
              setPhaseId(event.currentTarget.value);
            }}
          >
            <option value="">{t('tasks.noPhase')}</option>
            {(phases.data ?? []).map((phase) => (
              <option key={phase.id} value={phase.id}>
                {phase.name}
              </option>
            ))}
          </SelectField>
        ) : null}
        <TextField
          type="date"
          id={`convert-starts-${ticketId}`}
          label={t('tasks.startsOn')}
          value={startsOn}
          onChange={(event) => {
            setStartsOn(event.currentTarget.value);
          }}
        />
        <TextField
          type="date"
          id={`convert-due-${ticketId}`}
          label={t('tasks.dueOn')}
          value={dueOn}
          onChange={(event) => {
            setDueOn(event.currentTarget.value);
          }}
        />
      </FieldGrid>

      <p className="text-muted m-0 text-xs">{t('tasks.scheduleHint')}</p>

      {convertTicket.isError ? <Alert>{convertTicket.error.message}</Alert> : null}

      <div className="form-actions">
        <Button type="submit" disabled={convertTicket.isPending}>
          {t('tickets.convert')}
        </Button>
      </div>

      {created ? (
        <p className="text-muted m-0 text-sm">
          <Link to={taskPath(clientId, created.project_id, created.id)}>
            {t('tickets.openedAs', { title: created.title })}
          </Link>
        </p>
      ) : null}
    </form>
  );
}
