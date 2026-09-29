import { Link } from 'react-router';
import { LoginForm } from '../components/LoginForm';
import { paths } from '@/app/router/paths';
import { useI18n } from '@/features/i18n';
import { AuthScreen } from '../components/AuthScreen';

export function LoginPage() {
  const { t } = useI18n();

  return (
    <AuthScreen
      title={t('auth.signIn')}
      footer={
        <>
          <p>
            <Link to={paths.forgotPassword}>{t('auth.forgotPassword')}</Link>
          </p>
          <p>
            <Link to={paths.portalLogin}>{t('auth.clientSignIn')}</Link>
          </p>
        </>
      }
    >
      <LoginForm />
    </AuthScreen>
  );
}
