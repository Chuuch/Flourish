import { cn } from '@/lib/cn';
import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'default' | 'primary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant | undefined;
  size?: ButtonSize | undefined;
}

const variants: Record<ButtonVariant, string> = {
  default: 'border-line bg-surface text-ink hover:bg-canvas-elevated',
  primary: 'border-transparent bg-accent text-accent-fg hover:brightness-110',
  ghost: 'border-transparent bg-transparent text-muted hover:bg-accent/8 hover:text-ink',
  danger: 'border-line bg-surface text-muted hover:border-danger/45 hover:bg-canvas-elevated hover:text-danger',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'rounded-md px-2.5 py-1.5 text-xs font-semibold',
  md: 'rounded-lg px-3 py-2 text-sm font-semibold',
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
        'inline-flex items-center justify-center gap-2 border transition-[color,background-color,filter,opacity] duration-150 disabled:pointer-events-none disabled:opacity-45',
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
