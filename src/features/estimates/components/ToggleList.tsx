import { Checkbox } from '@/components/ui';
import { cn } from '@/lib/cn';

type Option = { value: string; label: string };

type ToggleListProps = {
  options: Option[];
  values: string[];
  onChange: (next: string[]) => void;
  className?: string | undefined;
};

export function ToggleList({ options, values, onChange, className }: ToggleListProps) {
  return (
    <div className={cn('col-span-full flex flex-wrap items-center gap-x-4 gap-y-2', className)}>
      {options.map((option) => {
        const checked = values.includes(option.value);
        return (
          <Checkbox
            key={option.value}
            label={option.label}
            checked={checked}
            onChange={(event) => {
              onChange(
                event.target.checked
                  ? values.includes(option.value)
                    ? values
                    : [...values, option.value]
                  : values.filter((value) => value !== option.value),
              );
            }}
          />
        );
      })}
    </div>
  );
}

type BoolToggleProps = {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  className?: string | undefined;
};

export function BoolToggle({ label, checked, onChange, className }: BoolToggleProps) {
  return (
    <Checkbox
      className={className}
      label={label}
      checked={checked}
      onChange={(event) => {
        onChange(event.target.checked);
      }}
    />
  );
}

type BoolToggleListProps = {
  items: { key: string; label: string; checked: boolean }[];
  onChange: (key: string, next: boolean) => void;
  className?: string | undefined;
};

export function BoolToggleList({ items, onChange, className }: BoolToggleListProps) {
  return (
    <div className={cn('col-span-full flex flex-wrap items-center gap-x-4 gap-y-2', className)}>
      {items.map((item) => (
        <BoolToggle
          key={item.key}
          label={item.label}
          checked={item.checked}
          onChange={(next) => {
            onChange(item.key, next);
          }}
        />
      ))}
    </div>
  );
}
