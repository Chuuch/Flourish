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
          'block w-full resize-y rounded-none border border-line bg-control px-3 py-2 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted/55 focus:border-accent focus:ring-[3px] focus:ring-accent/15',
          error && 'border-danger/50 focus:border-danger focus:ring-danger/15',
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
