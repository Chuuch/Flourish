import { cn } from '@/lib/cn';
import { useId, type TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string | undefined;
}

export function TextArea({ label, error, id, className, rows = 3, ...props }: TextAreaProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;

  return (
    <div className="min-w-0">
      <label htmlFor={fieldId}>{label}</label>
      <textarea
        id={fieldId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'block w-full resize-y rounded-[var(--radius-control)] border border-line bg-control px-3 py-2 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted/55 focus-visible:border-accent focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-55',
          error && 'border-danger/50 focus-visible:border-danger focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--danger)_18%,transparent)]',
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
