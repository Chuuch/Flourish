import { cn } from '@/lib/cn';
import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'default' | 'primary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant | undefined;
  size?: ButtonSize | undefined;
}

const variants: Record<ButtonVariant, string> = {
  default: 'border-line bg-surface text-ink hover:bg-canvas-elevated focus-visible:border-accent',
  primary:
    'border-transparent bg-accent text-accent-fg hover:opacity-90 focus-visible:border-accent',
  ghost:
    'border-transparent bg-transparent text-muted hover:bg-canvas-elevated hover:text-ink focus-visible:border-accent',
  danger:
    'border-line bg-surface text-muted hover:border-danger/40 hover:bg-canvas-elevated hover:text-danger focus-visible:border-danger',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'rounded-[var(--radius-control)] px-2.5 py-1.5 text-xs font-semibold',
  md: 'rounded-[var(--radius-control)] px-3 py-2 text-sm font-semibold',
};

export function Button({
  type = 'button',
  disabled,
  children,
  className,
  variant,
  size = 'md',
  ...props
}: ButtonProps) {
  const resolved = variant ?? (type === 'submit' ? 'primary' : 'default');

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 border cursor-pointer transition-[color,background-color,border-color,opacity] duration-150 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] disabled:pointer-events-none disabled:opacity-45',
        variants[resolved],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
