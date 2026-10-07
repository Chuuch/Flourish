import {
  clientInvoicesPath,
  clientPath,
  clientProjectsPath,
  clientTicketsPath,
  clientUsersPath,
  paths,
  projectFilesPath,
  projectPath,
  projectTasksPath,
} from '@/app/router/paths';
import { SidebarLink } from '@/components/ui';
import { useClients } from '@/features/clients/hooks/useClients';
import { useI18n } from '@/features/i18n';
import { useProjects } from '@/features/projects/hooks/useProjects';
import {
  Bell,
  Building2,
  ChartColumn,
  ChevronDown,
  ChevronRight,
  File,
  FolderKanban,
  History,
  House,
  ListTodo,
  Receipt,
  Ticket,
  Users,
  UsersRound,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { useNavCounts } from '../hooks/useNavCounts';

function ClientBranch({
  clientId,
  clientName,
  forceOpen,
}: {
  clientId: string;
  clientName: string;
  forceOpen: boolean;
}) {
  const { t } = useI18n();
  const { projectId } = useParams();
  const [open, setOpen] = useState(forceOpen);
  const projects = useProjects(clientId);

  useEffect(() => {
    if (forceOpen) {
      setOpen(true);
    }
  }, [forceOpen]);

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          className="text-muted hover:text-ink hover:bg-canvas-elevated/70 inline-flex size-7 shrink-0 items-center justify-center rounded-(--radius-control)"
          aria-expanded={open}
          aria-label={clientName}
          onClick={() => {
            setOpen((value) => !value);
          }}
        >
          {open ? (
            <ChevronDown className="size-3.5" aria-hidden="true" />
          ) : (
            <ChevronRight className="size-3.5" aria-hidden="true" />
          )}
        </button>
        <SidebarLink to={clientPath(clientId)} className="min-w-0 flex-1">
          {clientName}
        </SidebarLink>
      </div>

      {open ? (
        <div className="border-line ml-3.5 flex flex-col gap-0.5 border-l pl-2">
          <SidebarLink to={clientProjectsPath(clientId)} icon={FolderKanban}>
            {t('common.projects')}
          </SidebarLink>

          {(projects.data ?? []).map((project) => (
            <ProjectBranch
              key={project.id}
              clientId={clientId}
              projectId={project.id}
              projectName={project.name}
              forceOpen={projectId === project.id}
            />
          ))}

          <SidebarLink to={clientTicketsPath(clientId)} icon={Ticket}>
            {t('common.tickets')}
          </SidebarLink>
          <SidebarLink to={clientInvoicesPath(clientId)} icon={Receipt}>
            {t('common.invoices')}
          </SidebarLink>
          <SidebarLink to={clientUsersPath(clientId)} icon={Users}>
            {t('common.users')}
          </SidebarLink>
        </div>
      ) : null}
    </div>
  );
}

function ProjectBranch({
  clientId,
  projectId,
  projectName,
  forceOpen,
}: {
  clientId: string;
  projectId: string;
  projectName: string;
  forceOpen: boolean;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(forceOpen);

  useEffect(() => {
    if (forceOpen) {
      setOpen(true);
    }
  }, [forceOpen]);

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          className="text-muted hover:text-ink hover:bg-canvas-elevated/70 inline-flex size-7 shrink-0 items-center justify-center rounded-(--radius-control)"
          aria-expanded={open}
          aria-label={projectName}
          onClick={() => {
            setOpen((value) => !value);
          }}
        >
          {open ? (
            <ChevronDown className="size-3.5" aria-hidden="true" />
          ) : (
            <ChevronRight className="size-3.5" aria-hidden="true" />
          )}
        </button>
        <SidebarLink to={projectPath(clientId, projectId)} className="min-w-0 flex-1">
          {projectName}
        </SidebarLink>
      </div>

      {open ? (
        <div className="border-line ml-3.5 flex flex-col gap-0.5 border-l pl-2">
          <SidebarLink to={projectTasksPath(clientId, projectId)} icon={ListTodo}>
            {t('common.tasks')}
          </SidebarLink>
          <SidebarLink to={projectFilesPath(clientId, projectId)} icon={File}>
            {t('common.files')}
          </SidebarLink>
        </div>
      ) : null}
    </div>
  );
}

export function StaffSidebarNav() {
  const { t } = useI18n();
  const { clientId } = useParams();
  const location = useLocation();
  const { data: counts } = useNavCounts();
  const clients = useClients();
  const clientsSectionOpen = location.pathname.startsWith(paths.clients);

  return (
    <>
      <p className="text-muted mt-3.5 mb-1 px-2.5 text-[0.65rem] font-semibold tracking-[0.08em] uppercase">
        {t('nav.main')}
      </p>

      <SidebarLink to={paths.home} icon={House} end count={counts?.tasks} badge="solid">
        {t('nav.home')}
      </SidebarLink>

      <SidebarLink to={paths.clients} icon={Building2}>
        {t('nav.clients')}
      </SidebarLink>

      {clientsSectionOpen ? (
        <div className="mt-0.5 flex flex-col gap-0.5">
          {(clients.data ?? []).map((client) => (
            <ClientBranch
              key={client.id}
              clientId={client.id}
              clientName={client.name}
              forceOpen={clientId === client.id}
            />
          ))}
        </div>
      ) : null}

      <SidebarLink
        to={paths.notifications}
        icon={Bell}
        count={counts?.unread_notifications}
        badge="unread"
      >
        {t('nav.notifications')}
      </SidebarLink>

      <SidebarLink to={paths.activity} icon={History}>
        {t('nav.activity')}
      </SidebarLink>

      <SidebarLink to={paths.reports} icon={ChartColumn}>
        {t('nav.reports')}
      </SidebarLink>

      <SidebarLink to={paths.members} icon={UsersRound}>
        {t('nav.members')}
      </SidebarLink>
    </>
  );
}
