import { useI18n } from '@/features/i18n';
import { ResetPasswordForm } from '../components/ResetPasswordForm';

export function ResetPasswordPage() {
  const { t } = useI18n();
  return (
    <main>
      <h1>{t('auth.resetPassword')}</h1>
      <ResetPasswordForm />
    </main>
  );
}
