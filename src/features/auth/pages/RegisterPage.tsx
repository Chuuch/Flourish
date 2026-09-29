import { useI18n } from '@/features/i18n';
import { RegisterForm } from '../components/RegisterForm';
import { AuthScreen } from '../components/AuthScreen';

export function RegisterPage() {
  const { t } = useI18n();
  return (
    <AuthScreen title={t('auth.createAccountHeading')}>
      <RegisterForm />
    </AuthScreen>
  );
}
