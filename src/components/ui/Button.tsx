import { cn } from '@/lib/cn';
import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'default' | 'primary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant | undefined;
}

const variants: Record<ButtonVariant, string> = {
  default: 'border-line bg-surface text-ink hover:bg-line/50',
  primary: 'border-transparent bg-accent text-accent-fg hover:opacity-90',
  ghost: 'border-transparent bg-transparent text-ink hover:bg-line/60',
  danger: 'border-transparent bg-danger text-white hover:opacity-90',
};

export function Button({
  type = 'button',
  disabled,
  children,
  className,
  variant,
  ...props
}: ButtonProps) {
  const resolved = variant ?? (type === 'submit' ? 'primary' : 'default');

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
        variants[resolved],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
