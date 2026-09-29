import { Outlet } from 'react-router';
import { paths } from '../router/paths';
import { useAuthStore } from '@/features/auth';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { Button, SidebarLink } from '@/components/ui';
import { ThemeToggle } from '@/features/theme';
import { LocaleSwitcher, useI18n } from '@/features/i18n';
import {
  Building2,
  Clock,
  DoorOpen,
  House,
  Leaf,
  LogIn,
  LogOut,
  Settings,
  UserPlus,
  UsersRound,
} from 'lucide-react';

export function RootLayout() {
  const user = useAuthStore((state) => state.user);
  const organization = useAuthStore((state) => state.organization);
  const client = useAuthStore((state) => state.client);
  const role = useAuthStore((state) => state.role);
  const logout = useLogout();
  const isPortal = role === 'client';
  const { t } = useI18n();

  return (
    <div className="bg-canvas text-ink min-h-screen flex flex-col md:flex-row">
      <aside className="border-line bg-surface/90 sticky top-0 z-10 flex flex-col gap-6 border-b px-4 py-5 backdrop-blur-md md:h-screen md:w-64 md:shrink-0 md:border-r md:border-b-0">
        <p className="flex items-center gap-2 px-2">
          <Leaf className="text-accent size-5" aria-hidden="true" />
          <span className="text-base font-semibold tracking-tight">{t('home.brand')}</span>
        </p>

        <nav aria-label={t('nav.main')} className="flex flex-1 flex-col gap-1">
          <SidebarLink to={isPortal ? paths.portal : paths.home} icon={House} end>
            {t('nav.home')}
          </SidebarLink>
          {user && !isPortal ? (
            <>
              <SidebarLink to={paths.members} icon={UsersRound}>
                {t('nav.members')}
              </SidebarLink>
              <SidebarLink to={paths.clients} icon={Building2}>
                {t('nav.clients')}
              </SidebarLink>
              <SidebarLink to={paths.time} icon={Clock}>
                {t('nav.time')}
              </SidebarLink>
            </>
          ) : null}
          {user ? (
            <>
              {isPortal ? (
                client ? (
                  <p className="text-muted mt-3 px-2.5 text-xs font-medium">{client.name}</p>
                ) : null
              ) : organization ? (
                <p className="text-muted mt-3 px-2.5 text-xs font-medium">{organization.name}</p>
              ) : null}
              <SidebarLink to={isPortal ? paths.portalAccount : paths.account} icon={Settings}>
                {t('nav.account')}
              </SidebarLink>
              <Button
                type="button"
                variant="ghost"
                className="mt-1 justify-start px-2.5"
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

        <div className="border-line mt-auto flex flex-col gap-3 border-t pt-4">
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
      </aside>

      <div className="flex-1 px-4 py-8 md:px-10">
        <Outlet />
      </div>
    </div>
  );
}
