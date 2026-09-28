import { Link } from 'react-router';
import { PortalLoginForm } from '../components/PortalLoginForm';
import { paths } from '@/app/router/paths';
import { useI18n } from '@/features/i18n';

export function PortalLoginPage() {
  const { t } = useI18n();
  return (
    <main>
      <h1>{t('auth.clientSignIn')}</h1>
      <PortalLoginForm />
      <p>
        <Link to={paths.forgotPassword}>{t('auth.forgotPassword')}</Link>
      </p>
      <p>
        <Link to={paths.login}>{t('auth.staffSignIn')}</Link>
      </p>
    </main>
  );
}
