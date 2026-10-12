import { Button, SidebarLink } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { LocaleSwitcher, useI18n } from '@/features/i18n';
import { StaffSidebarNav } from '@/features/nav/components/StaffSidebarNav';
import { useNavCounts } from '@/features/nav/hooks/useNavCounts';
import { ThemeToggle } from '@/features/theme';
import {
  Bell,
  DoorOpen,
  House,
  Leaf,
  LogIn,
  LogOut,
  Receipt,
  Settings,
  UserPlus,
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
  const { data: counts } = useNavCounts();

  return (
    <div className="text-ink flex h-dvh flex-col overflow-hidden md:flex-row">
      <aside className="border-line bg-surface flex max-h-[45vh] shrink-0 flex-col gap-4 overflow-y-auto border-b px-3 py-4 md:h-full md:max-h-none md:w-[18rem] md:border-r md:border-b-0 md:px-3 md:py-5">
        <p className="flex items-center gap-2 px-2.5 pt-0.5">
          <Leaf className="text-accent size-4 shrink-0" aria-hidden="true" />
          <span className="truncate text-[0.95rem] font-semibold tracking-tight">
            {user
              ? isPortal
                ? (client?.name ?? t('home.brand'))
                : (organization?.name ?? t('home.brand'))
              : t('home.brand')}
          </span>
        </p>

        <nav aria-label={t('nav.main')} className="flex flex-1 flex-col gap-0.5">
          {user && !isPortal ? <StaffSidebarNav /> : null}

          {user && isPortal ? (
            <>
              <SidebarLink to={paths.portal} icon={House} end>
                {t('nav.home')}
              </SidebarLink>
              <SidebarLink
                to={paths.portalNotifications}
                icon={Bell}
                count={counts?.unread_notifications}
                badge="unread"
              >
                {t('nav.notifications')}
              </SidebarLink>
              <SidebarLink to={paths.portalInvoices} icon={Receipt}>
                {t('common.invoices')}
              </SidebarLink>
              <SidebarLink to={paths.portalAccount} icon={Settings}>
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
          ) : null}

          {user && !isPortal ? (
            <>
              <SidebarLink to={paths.account} icon={Settings}>
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
          ) : null}

          {!user ? (
            <>
              <SidebarLink to={paths.home} icon={House} end>
                {t('nav.home')}
              </SidebarLink>
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
          ) : null}
        </nav>

        <div className="border-line mt-auto flex flex-col gap-2 border-t pt-3">
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
      </aside>

      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-6 md:px-8 md:py-8">
        <Outlet />
      </div>
    </div>
  );
}
