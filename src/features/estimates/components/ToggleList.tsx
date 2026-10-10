type Option = { value: string; label: string };

type ToggleListProps = {
  options: Option[];
  values: string[];
  onChange: (next: string[]) => void;
};

export function ToggleList({ options, values, onChange }: ToggleListProps) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => {
        const checked = values.includes(option.value);
        return (
          <label key={option.value} className="text-ink flex items-center gap-2 text-sm">
            <input
              type="checkbox"
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
            {option.label}
          </label>
        );
      })}
    </div>
  );
}

type BoolToggleProps = {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
};

export function BoolToggle({ label, checked, onChange }: BoolToggleProps) {
  return (
    <label className="text-ink flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => {
          onChange(event.target.checked);
        }}
      />
      {label}
    </label>
  );
}

type BoolToggleListProps = {
  items: { key: string; label: string; checked: boolean }[];
  onChange: (key: string, next: boolean) => void;
};

export function BoolToggleList({ items, onChange }: BoolToggleListProps) {
  return (
    <div className="flex flex-col gap-2">
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
