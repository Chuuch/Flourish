import { clientProjectsPath, paths } from '@/app/router/paths';
import { PageHeader, SearchField } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { ClientCrumb } from '@/features/clients/components/ClientCrumb';
import { useI18n } from '@/features/i18n';
import { useModal } from '@/features/modal';
import { ProjectCrumb } from '@/features/projects/components/ProjectCrumb';
import { useListSearch } from '@/hooks/useListSearch';
import { Link, useParams } from 'react-router';
import { CreateFileForm } from '../components/CreateFileForm';
import { FileList } from '../components/FileList';
import { canManageFiles } from '../schemas/file.schema';

export function FilesPage() {
  const { clientId, projectId } = useParams();
  const { t } = useI18n();
  const { openModal, closeModal } = useModal();
  const role = useAuthStore((state) => state.role);
  const canCreate = canManageFiles(role);
  const { value, setValue, query } = useListSearch();

  if (!clientId || !projectId) {
    return (
      <main>
        <PageHeader title={t('files.title')} description={t('files.empty')} />
      </main>
    );
  }

  return (
    <main>
      <p>
        <Link to={paths.clients}>{t('common.clients')}</Link>
        {' / '}
        <ClientCrumb clientId={clientId} />
        {' / '}
        <Link to={clientProjectsPath(clientId)}>{t('common.projects')}</Link>
        {' / '}
        <ProjectCrumb clientId={clientId} projectId={projectId} />
      </p>
      <PageHeader
        title={t('files.title')}
        {...(canCreate
          ? {
              createLabel: t('common.upload'),
              onCreate: () => {
                openModal({
                  title: t('common.upload'),
                  content: (
                    <CreateFileForm
                      projectId={projectId}
                      onSuccess={() => {
                        closeModal();
                      }}
                      onCancel={() => {
                        closeModal();
                      }}
                    />
                  ),
                });
              },
            }
          : {})}
      />
      <div className="mb-4">
        <SearchField
          label={t('common.search')}
          placeholder={t('files.searchPlaceholder')}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
        />
      </div>
      <FileList projectId={projectId} query={query} />
    </main>
  );
}
