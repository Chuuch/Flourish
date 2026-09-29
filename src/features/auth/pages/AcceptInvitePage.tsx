import { useI18n } from '@/features/i18n';
import { AcceptInviteForm } from '../components/AcceptInviteForm';
import { AuthScreen } from '../components/AuthScreen';

export function AcceptInvitePage() {
  const { t } = useI18n();
  return (
    <AuthScreen title={t('auth.setPassword')}>
      <AcceptInviteForm />
    </AuthScreen>
  );
}
