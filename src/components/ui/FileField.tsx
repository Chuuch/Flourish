import { cn } from '@/lib/cn';
import { useI18n } from '@/features/i18n';
import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type Ref,
} from 'react';
import { Button } from './Button';

interface FileFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string | undefined;
  ref?: Ref<HTMLInputElement>;
}

export function FileField({
  label,
  error,
  id,
  className,
  ref,
  onChange,
  ...props
}: FileFieldProps) {
  const { t } = useI18n();
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const localRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  function assignRef(node: HTMLInputElement | null) {
    localRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setFileName(event.target.files?.[0]?.name ?? null);
    onChange?.(event);
  }

  return (
    <div className="min-w-0">
      <label htmlFor={inputId}>{label}</label>
      <div className={cn('file-picker', className)}>
        <input
          id={inputId}
          ref={assignRef}
          type="file"
          className="sr-only"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={handleChange}
          {...props}
        />
        <Button
          type="button"
          size="sm"
          onClick={() => {
            localRef.current?.click();
          }}
        >
          {t('files.choose')}
        </Button>
        <span className="text-muted min-w-0 truncate text-sm">{fileName ?? t('files.noFile')}</span>
      </div>
      {error ? (
        <p id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
