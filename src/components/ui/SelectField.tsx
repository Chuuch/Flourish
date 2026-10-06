import { cn } from '@/lib/cn';
import { useId, type SelectHTMLAttributes } from 'react';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string | undefined;
  hideLabel?: boolean | undefined;
}

export function SelectField({
  label,
  error,
  hideLabel = false,
  id,
  className,
  children,
  ...props
}: SelectFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;

  return (
    <div className="min-w-0">
      <label htmlFor={fieldId} className={hideLabel ? 'sr-only' : undefined}>
        {label}
      </label>
      <select
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'block w-full appearance-none rounded-[var(--radius-control)] border border-line bg-control bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat px-3 py-2 pr-10 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-150 focus-visible:border-accent focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-55',
          error && 'border-danger/50 focus-visible:border-danger focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--danger)_18%,transparent)]',
          hideLabel && 'py-1.5 text-xs',
          className,
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b6b6b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
        }}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
