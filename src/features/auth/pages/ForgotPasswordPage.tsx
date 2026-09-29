import { useI18n } from '@/features/i18n';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { AuthScreen } from '../components/AuthScreen';

export function ForgotPasswordPage() {
  const { t } = useI18n();
  return (
    <AuthScreen title={t('auth.resetPassword')}>
      <ForgotPasswordForm />
    </AuthScreen>
  );
}
