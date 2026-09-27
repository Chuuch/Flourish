import { clientProjectsPath, paths } from '@/app/router/paths';
import { Link, useParams } from 'react-router';
import { CreateFileForm } from '../components/CreateFileForm';
import { FileList } from '../components/FileList';
import { useI18n } from '@/features/i18n';

export function FilesPage() {
  const { clientId, projectId } = useParams();
  const { t } = useI18n();

  if (!clientId || !projectId) {
    return (
      <main>
        <h1>{t('files.title')}</h1>
        <p>{t('files.empty')}</p>
      </main>
    );
  }

  return (
    <main>
      <p>
        <Link to={paths.clients}>{t('common.clients')}</Link>
        {' / '}
        <Link to={clientProjectsPath(clientId)}>{t('common.projects')}</Link>
      </p>
      <h1>{t('files.title')}</h1>
      <CreateFileForm projectId={projectId} />
      <FileList projectId={projectId} />
    </main>
  );
}
