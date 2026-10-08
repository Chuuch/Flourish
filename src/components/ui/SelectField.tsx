import { cn } from '@/lib/cn';
import { ChevronDown } from 'lucide-react';
import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FocusEventHandler,
  type OptionHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
  type SelectHTMLAttributes,
} from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled: boolean;
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label: string;
  error?: string | undefined;
  hideLabel?: boolean | undefined;
  ref?: Ref<HTMLSelectElement | null> | undefined;
}

interface ListboxPosition {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
}

const LISTBOX_GAP = 4;
const LISTBOX_MAX_HEIGHT = 224;
const VIEWPORT_PADDING = 8;

function collectOptions(children: ReactNode): SelectOption[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child) || child.type !== 'option') {
      return [];
    }

    const option = child as ReactElement<OptionHTMLAttributes<HTMLOptionElement>>;
    const value = option.props.value == null ? '' : String(option.props.value);
    const label =
      typeof option.props.children === 'string' || typeof option.props.children === 'number'
        ? String(option.props.children)
        : value;

    return [
      {
        value,
        label,
        disabled: Boolean(option.props.disabled),
      },
    ];
  });
}

function measureListboxPosition(trigger: HTMLElement): ListboxPosition {
  const rect = trigger.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_PADDING;
  const spaceAbove = rect.top - VIEWPORT_PADDING;
  const openAbove = spaceBelow < Math.min(LISTBOX_MAX_HEIGHT, 160) && spaceAbove > spaceBelow;
  const available = openAbove ? spaceAbove : spaceBelow;
  const maxHeight = Math.max(96, Math.min(LISTBOX_MAX_HEIGHT, available - LISTBOX_GAP));

  if (openAbove) {
    return {
      bottom: window.innerHeight - rect.top + LISTBOX_GAP,
      left: rect.left,
      width: rect.width,
      maxHeight,
    };
  }

  return {
    top: rect.bottom + LISTBOX_GAP,
    left: rect.left,
    width: rect.width,
    maxHeight,
  };
}

export function SelectField({
  label,
  error,
  hideLabel = false,
  id,
  className,
  children,
  disabled,
  value,
  defaultValue,
  name,
  onChange,
  onBlur,
  ref,
  'aria-label': ariaLabel,
  ...props
}: SelectFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const listboxId = `${fieldId}-listbox`;
  const errorId = `${fieldId}-error`;
  const options = useMemo(() => collectOptions(children), [children]);
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listboxRef = useRef<HTMLUListElement | null>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<ListboxPosition | null>(null);
  const [internalValue, setInternalValue] = useState(() => String(value ?? defaultValue ?? ''));

  const selectedValue = value !== undefined ? String(value) : internalValue;
  const selectedOption = options.find((option) => option.value === selectedValue) ?? options[0];
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === selectedValue),
  );

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(String(value));
    }
  }, [value]);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) {
      setPosition(null);
      return;
    }

    function updatePosition() {
      if (!triggerRef.current) {
        return;
      }
      setPosition(measureListboxPosition(triggerRef.current));
    }

    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, options.length]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || listboxRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function assignRefs(node: HTMLSelectElement | null) {
    selectRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }

  function commitValue(next: string) {
    setInternalValue(next);
    const select = selectRef.current;
    if (select) {
      select.value = next;
    }

    onChange?.({
      target: { value: next, name: name ?? '' },
      currentTarget: { value: next, name: name ?? '' },
      type: 'change',
    } as unknown as ChangeEvent<HTMLSelectElement>);
    setOpen(false);
  }

  function moveSelection(delta: number) {
    if (options.length === 0) {
      return;
    }

    let index = selectedIndex;
    for (let step = 0; step < options.length; step += 1) {
      index = (index + delta + options.length) % options.length;
      const candidate = options[index];
      if (candidate && !candidate.disabled) {
        commitValue(candidate.value);
        setOpen(true);
        return;
      }
    }
  }

  const listboxStyle: CSSProperties | undefined = position
    ? {
        top: position.top,
        bottom: position.bottom,
        left: position.left,
        width: position.width,
        maxHeight: position.maxHeight,
      }
    : undefined;

  return (
    <div className="min-w-0" ref={rootRef}>
      <label htmlFor={fieldId} className={hideLabel ? 'sr-only' : undefined}>
        {label}
      </label>

      <div className="relative">
        <button
          ref={triggerRef}
          id={fieldId}
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'border-line bg-control text-ink hover:border-ink/20 cursor-pointer flex w-full items-center justify-between gap-2 border px-3 text-left outline-none transition-[border-color,box-shadow,background-color] duration-150 focus-visible:border-accent focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-55',
            'rounded-[var(--radius-control)]',
            hideLabel ? 'py-1.5 text-xs' : 'py-2 text-sm',
            open && 'border-accent shadow-[var(--focus-ring)]',
            error &&
              'border-danger/50 focus-visible:border-danger focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--danger)_18%,transparent)]',
            className,
          )}
          data-value={selectedValue}
          onClick={() => {
            if (!disabled) {
              setOpen((current) => !current);
            }
          }}
          onBlur={onBlur as unknown as FocusEventHandler<HTMLButtonElement>}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              if (!open) {
                setOpen(true);
              } else {
                moveSelection(1);
              }
            }
            if (event.key === 'ArrowUp') {
              event.preventDefault();
              if (!open) {
                setOpen(true);
              } else {
                moveSelection(-1);
              }
            }
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setOpen((current) => !current);
            }
          }}
        >
          <span className={cn('min-w-0 truncate', !selectedOption?.label && 'text-muted')}>
            {selectedOption?.label || '—'}
          </span>
          <ChevronDown
            className={cn(
              'text-muted size-4 shrink-0 transition-transform duration-150',
              open && 'rotate-180',
            )}
            aria-hidden="true"
          />
        </button>

        {open ? (
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={fieldId}
            style={listboxStyle}
            className={cn(
              'border-line bg-surface fixed z-50 overflow-auto rounded-[var(--radius-panel)] border p-1 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.45)]',
              !position && 'invisible',
            )}
          >
            {options.map((option) => {
              const selected = option.value === selectedValue;
              return (
                <li key={`${option.value}-${option.label}`} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    data-value={option.value}
                    disabled={option.disabled || disabled}
                    className={cn(
                      'hover:bg-canvas-elevated cursor-pointer flex w-full items-center rounded-[var(--radius-badge)] px-2.5 py-2 text-left text-sm transition-colors duration-100 disabled:cursor-not-allowed disabled:opacity-45',
                      selected && 'bg-canvas-elevated font-medium text-ink',
                      !selected && 'text-ink',
                      hideLabel && 'py-1.5 text-xs',
                    )}
                    onMouseDown={(event) => {
                      event.preventDefault();
                    }}
                    onClick={() => {
                      if (!option.disabled) {
                        commitValue(option.value);
                      }
                    }}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      <select
        ref={assignRefs}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
        disabled={disabled}
        name={name}
        value={selectedValue}
        onChange={onChange}
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
