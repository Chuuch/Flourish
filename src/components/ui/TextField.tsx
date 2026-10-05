import { cn } from '@/lib/cn';
import { useId, type InputHTMLAttributes } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
}

export function TextField({ label, error, hint, id, className, ...props }: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="min-w-0">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={cn(
          'block w-full rounded-sm border border-line bg-control px-3 py-2 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted/55 focus:border-accent focus:ring-[3px] focus:ring-accent/15',
          error && 'border-danger/50 focus:border-danger focus:ring-danger/15',
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-muted mt-1 text-xs">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
