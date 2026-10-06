import { BrandMark } from '@/components/ui/BrandMark';
import { useI18n } from '@/features/i18n';
import type { ReactNode } from 'react';

interface AuthScreenProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode | undefined;
}

export function AuthScreen({ title, children, footer }: AuthScreenProps) {
  const { t } = useI18n();

  return (
    <main className="auth-screen">
      <div className="auth-panel">
        <div className="auth-panel-form">
          <h1>{title}</h1>
          {children}
          {footer}
        </div>
        <div className="auth-panel-brand">
          <BrandMark size="lg" />
          <p>{t('home.slogan')}</p>
        </div>
      </div>
    </main>
  );
}
