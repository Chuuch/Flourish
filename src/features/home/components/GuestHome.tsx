import { Link } from 'react-router';
import { Leaf } from 'lucide-react';
import { paths } from '@/app/router/paths';
import { BrandMark } from '@/components/ui';
import { useI18n } from '@/features/i18n';

export function GuestHome() {
  const { t } = useI18n();

  return (
    <main className="guest-hero">
      <section className="hero-copy">
        <div className="hero-graphic" aria-hidden="true">
          <span className="hero-ring" />
          <span className="hero-ring hero-ring-delay" />
          <div className="hero-leaf">
            <Leaf className="text-accent size-10" />
          </div>
        </div>
        <BrandMark size="lg" />
        <h1>{t('home.heroLead')}</h1>
        <p className="hero-body">{t('home.heroBody')}</p>
        <div className="hero-ctas">
          <Link to={paths.login} className="hero-cta-primary">
            {t('nav.signIn')}
          </Link>
          <Link to={paths.register} className="hero-cta-secondary">
            {t('nav.createAccount')}
          </Link>
        </div>
      </section>
    </main>
  );
}
