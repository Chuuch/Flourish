import { cn } from '@/lib/cn';
import type { LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router';
import type { ReactNode } from 'react';

interface SidebarLinkProps {
  to: string;
  icon: LucideIcon;
  children: ReactNode;
  end?: boolean | undefined;
}

export function SidebarLink({ to, icon: Icon, children, end }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      {...(end ? { end: true } : {})}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm no-underline transition-colors',
          isActive
            ? 'bg-accent/12 font-semibold text-accent'
            : 'text-ink/80 hover:bg-line/70 hover:text-ink',
        )
      }
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {children}
    </NavLink>
  );
}
