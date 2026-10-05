import { Button, SidebarLink } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { LocaleSwitcher, useI18n } from '@/features/i18n';
import { ThemeToggle } from '@/features/theme';
import {
    Bell,
    Building2,
    ChartColumn,
    DoorOpen,
    History,
    House,
    Leaf,
    LogIn,
    LogOut,
    Receipt,
    Settings,
    UserPlus,
    UsersRound,
} from 'lucide-react';
import { Outlet } from 'react-router';
import { paths } from '../router/paths';

export function RootLayout() {
  const user = useAuthStore((state) => state.user);
  const organization = useAuthStore((state) => state.organization);
  const client = useAuthStore((state) => state.client);
  const role = useAuthStore((state) => state.role);
  const logout = useLogout();
  const isPortal = role === 'client';
  const { t } = useI18n();

  return (
    <div className="bg-transparent text-ink flex min-h-screen flex-col md:flex-row">
      <aside className="border-line/80 bg-surface/85 sticky top-0 z-10 flex flex-col gap-5 border-b px-3 py-4 backdrop-blur-xl md:h-screen md:w-[15.5rem] md:shrink-0 md:border-r md:border-b-0 md:px-3.5 md:py-5">
        <p className="flex items-center gap-2.5 px-2.5 pt-1">
          <span className="border-line bg-accent/10 inline-grid size-8 place-items-center rounded-full border">
            <Leaf className="text-accent size-4" aria-hidden="true" />
          </span>
          <span className="text-[1.05rem] font-bold tracking-tight">{t('home.brand')}</span>
        </p>

        <nav aria-label={t('nav.main')} className="flex flex-1 flex-col gap-0.5">
          <SidebarLink to={isPortal ? paths.portal : paths.home} icon={House} end>
            {t('nav.home')}
          </SidebarLink>
          {user && !isPortal ? (
            <>
              <p className="text-muted mt-4 mb-1 px-3 text-[0.65rem] font-bold tracking-[0.1em] uppercase">
                {t('nav.main')}
              </p>
              <SidebarLink to={paths.members} icon={UsersRound}>
                {t('nav.members')}
              </SidebarLink>
              <SidebarLink to={paths.clients} icon={Building2}>
                {t('nav.clients')}
              </SidebarLink>
              <SidebarLink to={paths.activity} icon={History}>
                {t('nav.activity')}
              </SidebarLink>
              <SidebarLink to={paths.reports} icon={ChartColumn}>
                {t('nav.reports')}
              </SidebarLink>
              <SidebarLink to={paths.notifications} icon={Bell}>
                {t('nav.notifications')}
              </SidebarLink>
            </>
          ) : null}
          {user ? (
            <>
              {isPortal ? (
                <>
                  <SidebarLink to={paths.portalNotifications} icon={Bell}>
                    {t('nav.notifications')}
                  </SidebarLink>
                  <SidebarLink to={paths.portalInvoices} icon={Receipt}>
                    {t('common.invoices')}
                  </SidebarLink>
                </>
              ) : null}
              {isPortal ? (
                client ? (
                  <p className="text-muted mt-4 px-3 text-xs font-medium tracking-wide">
                    {client.name}
                  </p>
                ) : null
              ) : organization ? (
                <p className="text-muted mt-4 px-3 text-xs font-medium tracking-wide">
                  {organization.name}
                </p>
              ) : null}
              <SidebarLink to={isPortal ? paths.portalAccount : paths.account} icon={Settings}>
                {t('nav.account')}
              </SidebarLink>
              <Button
                type="button"
                variant="ghost"
                className="mt-1 justify-start px-3"
                onClick={() => {
                  logout.mutate();
                }}
                disabled={logout.isPending}
              >
                <LogOut className="size-4" aria-hidden="true" />
                {t('nav.signOut')}
              </Button>
            </>
          ) : (
            <>
              <SidebarLink to={paths.login} icon={LogIn}>
                {t('nav.signIn')}
              </SidebarLink>
              <SidebarLink to={paths.register} icon={UserPlus}>
                {t('nav.createAccount')}
              </SidebarLink>
              <SidebarLink to={paths.portalLogin} icon={DoorOpen}>
                {t('nav.clientSignIn')}
              </SidebarLink>
            </>
          )}
        </nav>

        <div className="border-line mt-auto flex flex-col gap-2.5 border-t pt-3.5">
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
      </aside>

      <div className="flex-1 px-4 py-7 md:px-10 md:py-9">
        <Outlet />
      </div>
    </div>
  );
}
