import { cn } from '@/lib/cn';
import { useId, type InputHTMLAttributes, type ReactNode } from 'react';

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> {
  label: ReactNode;
  description?: ReactNode | undefined;
}

export function Radio({
  label,
  description,
  className,
  id,
  disabled,
  checked,
  ...props
}: RadioProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <label
      htmlFor={fieldId}
      className={cn(
        'group flex cursor-pointer items-start gap-2.5 text-sm select-none',
        disabled && 'cursor-not-allowed opacity-55',
        className,
      )}
    >
      <span className="relative mt-0.5 inline-flex size-4 shrink-0">
        <input
          id={fieldId}
          type="radio"
          className="peer sr-only"
          disabled={disabled}
          checked={checked}
          {...props}
        />
        <span
          aria-hidden="true"
          className={cn(
            'border-line bg-control flex size-4 items-center justify-center rounded-full border transition-colors duration-100',
            'peer-focus-visible:shadow-(--focus-ring)',
            'peer-checked:border-accent peer-checked:[&>span]:opacity-100',
            'group-hover:border-accent/50 peer-checked:group-hover:border-accent',
          )}
        >
          <span className="bg-accent size-2 rounded-full opacity-0 transition-opacity duration-100" />
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="text-ink block leading-snug">{label}</span>
        {description ? (
          <span className="text-muted mt-0.5 block text-xs">{description}</span>
        ) : null}
      </span>
    </label>
  );
}

type RadioOption = {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

type RadioGroupProps = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  className?: string | undefined;
  disabled?: boolean | undefined;
};

export function RadioGroup({
  name,
  value,
  onChange,
  options,
  className,
  disabled,
}: RadioGroupProps) {
  return (
    <div role="radiogroup" className={cn('flex flex-col gap-2', className)}>
      {options.map((option) => (
        <Radio
          key={option.value}
          name={name}
          value={option.value}
          label={option.label}
          description={option.description}
          checked={value === option.value}
          disabled={disabled || option.disabled}
          onChange={() => {
            onChange(option.value);
          }}
        />
      ))}
    </div>
  );
}
