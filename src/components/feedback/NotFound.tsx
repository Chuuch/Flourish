import { paths } from '@/app/router/paths';
import { useI18n } from '@/features/i18n';
import { FileQuestion } from 'lucide-react';
import { Link } from 'react-router';

export function NotFound() {
  const { t } = useI18n();
  return (
    <main>
      <FileQuestion className="text-muted size-10" aria-hidden="true" />
      <h1>{t('notFound.title')}</h1>
      <p className="text-muted">{t('notFound.body')}</p>
      <p>
        <Link to={paths.home}>{t('notFound.goHome')}</Link>
      </p>
    </main>
  );
}
