import { cn } from '@/lib/cn';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { NavLink } from 'react-router';

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
          'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm no-underline transition-colors duration-150',
          isActive
            ? 'bg-accent/12 text-accent font-semibold'
            : 'text-muted hover:bg-accent/8 hover:text-ink',
        )
      }
    >
      <Icon className="size-4 shrink-0 opacity-90" aria-hidden="true" />
      <span className="truncate">{children}</span>
    </NavLink>
  );
}
