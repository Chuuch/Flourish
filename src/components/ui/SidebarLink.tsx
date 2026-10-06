import { cn } from '@/lib/cn';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { NavLink } from 'react-router';

interface SidebarLinkProps {
  to: string;
  icon?: LucideIcon | undefined;
  children: ReactNode;
  end?: boolean | undefined;
  count?: number | undefined;
  badge?: 'solid' | 'unread' | undefined;
  className?: string | undefined;
}

export function SidebarLink({
  to,
  icon: Icon,
  children,
  end,
  count,
  badge = 'solid',
  className,
}: SidebarLinkProps) {
  const showCount = typeof count === 'number' && (badge === 'unread' ? count > 0 : true);

  return (
    <NavLink
      to={to}
      {...(end ? { end: true } : {})}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2.5 rounded-(--radius-control) px-2.5 py-1.5 text-sm no-underline transition-colors duration-150 focus-visible:outline-none focus-visible:shadow-(--focus-ring)',
          isActive
            ? 'bg-canvas-elevated text-ink font-semibold'
            : 'text-muted hover:bg-canvas-elevated/70 hover:text-ink',
          className,
        )
      }
    >
      {Icon ? <Icon className="size-4 shrink-0 opacity-80" aria-hidden="true" /> : null}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {showCount ? (
        <span
          className={cn(
            'tabular-nums shrink-0 text-[0.6875rem] font-semibold',
            badge === 'unread'
              ? 'bg-accent text-accent-fg min-w-5 rounded-full px-1.5 py-0.5 text-center'
              : 'text-muted border-line rounded-(--radius-badge) border px-1.5 py-0.5',
          )}
        >
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </NavLink>
  );
}
