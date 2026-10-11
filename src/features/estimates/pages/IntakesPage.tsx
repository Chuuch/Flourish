import { paths } from '@/app/router/paths';
import { useI18n } from '@/features/i18n';
import { Link } from 'react-router';
import { CreateIntakeForm } from '../components/CreateIntakeForm';
import { IntakeList } from '../components/IntakeList';

export function IntakesPage() {
  const { t } = useI18n();

  return (
    <main>
      <p className="breadcrumb">
        <Link to={paths.estimates}>{t('estimates.title')}</Link>
        <span aria-hidden="true">/</span>
        <span>{t('intake.inboxTitle')}</span>
      </p>
      <div className="page-header">
        <h1>{t('intake.inboxTitle')}</h1>
      </div>
      <CreateIntakeForm />
      <div className="mt-8">
        <h2 className="text-sm font-semibold">{t('intake.recent')}</h2>
        <IntakeList />
      </div>
    </main>
  );
}
