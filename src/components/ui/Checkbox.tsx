import { cn } from '@/lib/cn';
import { Check } from 'lucide-react';
import { useId, type InputHTMLAttributes, type ReactNode } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> {
  label: ReactNode;
  description?: ReactNode | undefined;
}

export function Checkbox({
  label,
  description,
  className,
  id,
  disabled,
  checked,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <label
      htmlFor={fieldId}
      data-control
      className={cn(
        'group cursor-pointer select-none',
        disabled && 'cursor-not-allowed opacity-55',
        className,
      )}
    >
      <span className="relative inline-flex size-4 shrink-0">
        <input
          id={fieldId}
          type="checkbox"
          className="peer sr-only"
          disabled={disabled}
          checked={checked}
          {...props}
        />
        <span
          aria-hidden="true"
          className={cn(
            'border-line bg-control flex size-4 items-center justify-center rounded-sm border transition-colors duration-100',
            'peer-focus-visible:shadow-(--focus-ring)',
            'peer-checked:border-accent peer-checked:bg-accent peer-checked:[&_svg]:opacity-100',
            'group-hover:border-accent/50 peer-checked:group-hover:border-accent',
          )}
        >
          <Check
            className="text-accent-fg size-3 opacity-0 transition-opacity duration-100"
            strokeWidth={3}
          />
        </span>
      </span>
      <span className="min-w-0 leading-none">
        <span className="text-ink leading-none">{label}</span>
        {description ? (
          <span className="text-muted mt-0.5 block text-xs leading-snug">{description}</span>
        ) : null}
      </span>
    </label>
  );
}
