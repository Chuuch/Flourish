import { paths } from '@/app/router/paths';
import { useI18n } from '@/features/i18n';
import { Link } from 'react-router';

export function NotFound() {
  const { t } = useI18n();
  return (
    <main>
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.body')}</p>
      <Link to={paths.home}>{t('notFound.goHome')}</Link>
    </main>
  );
}
