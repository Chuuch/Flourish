import { NavLink, Outlet } from 'react-router';
import { paths } from '../router/paths';
import { useAuthStore } from '@/features/auth';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { Button } from '@/components/ui';
import { ThemeToggle } from '@/features/theme';
import { LocaleSwitcher, useI18n } from '@/features/i18n';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'font-semibold underline' : 'hover:underline';

export function RootLayout() {
  const user = useAuthStore((state) => state.user);
  const organization = useAuthStore((state) => state.organization);
  const client = useAuthStore((state) => state.client);
  const role = useAuthStore((state) => state.role);
  const logout = useLogout();
  const isPortal = role === 'client';
  const { t } = useI18n();

  return (
    <div className="bg-canvas text-ink min-h-screen flex flex-col">
      <header className="border-b border-line px-6 py-4">
        <nav aria-label={t('nav.main')} className="flex gap-6">
          <NavLink to={isPortal ? paths.portal : paths.home} className={navLinkClass} end>
            {t('nav.home')}
          </NavLink>
          {isPortal ? null : (
            <>
              <NavLink to={paths.members} className={navLinkClass}>
                {t('nav.members')}
              </NavLink>
              <NavLink to={paths.clients} className={navLinkClass}>
                {t('nav.clients')}
              </NavLink>
            </>
          )}
          {user ? (
            <>
              {isPortal ? (
                client ? (
                  <span>{client.name}</span>
                ) : null
              ) : organization ? (
                <span>{organization.name}</span>
              ) : null}
              <NavLink to={isPortal ? paths.portalAccount : paths.account} className={navLinkClass}>
                {t('nav.account')}
              </NavLink>
              <Button
                type="button"
                onClick={() => {
                  logout.mutate();
                }}
                disabled={logout.isPending}
              >
                {t('nav.signOut')}
              </Button>
            </>
          ) : (
            <>
              <NavLink to={paths.login} className={navLinkClass}>
                {t('nav.signIn')}
              </NavLink>
              <NavLink to={paths.register} className={navLinkClass}>
                {t('nav.createAccount')}
              </NavLink>
              <NavLink to={paths.portalLogin} className={navLinkClass}>
                {t('nav.clientSignIn')}
              </NavLink>
            </>
          )}
          <ThemeToggle />
          <LocaleSwitcher />
        </nav>
      </header>

      <div className="flex-1 px-6 py-8">
        <Outlet />
      </div>
    </div>
  );
}
