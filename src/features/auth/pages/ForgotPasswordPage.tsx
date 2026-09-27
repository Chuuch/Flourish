import { useI18n } from '@/features/i18n';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';

export function ForgotPasswordPage() {
  const { t } = useI18n();
  return (
    <main>
      <h1>{t('auth.forgotPassword')}</h1>
      <ForgotPasswordForm />
    </main>
  );
}
