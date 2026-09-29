import { Link } from 'react-router';
import { PortalLoginForm } from '../components/PortalLoginForm';
import { paths } from '@/app/router/paths';
import { useI18n } from '@/features/i18n';
import { AuthScreen } from '@/features/auth/components/AuthScreen';

export function PortalLoginPage() {
  const { t } = useI18n();
  return (
    <AuthScreen
      title={t('auth.clientSignIn')}
      footer={
        <>
          <p>
            <Link to={paths.forgotPassword}>{t('auth.forgotPassword')}</Link>
          </p>
          <p>
            <Link to={paths.login}>{t('auth.staffSignIn')}</Link>
          </p>
        </>
      }
    >
      <PortalLoginForm />
    </AuthScreen>
  );
}
