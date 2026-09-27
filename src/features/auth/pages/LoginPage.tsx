import { Link } from 'react-router';
import { LoginForm } from '../components/LoginForm';
import { paths } from '@/app/router/paths';
import { useI18n } from '@/features/i18n';

export function LoginPage() {
  const { t } = useI18n();

  return (
    <main>
      <h1>{t('auth.signIn')}</h1>
      <LoginForm />
      <p>
        <Link to={paths.forgotPassword}>{t('auth.forgotPassword')}</Link>
      </p>
      <p>
        <Link to={paths.portalLogin}>{t('auth.clientSignIn')}</Link>
      </p>
    </main>
  );
}
