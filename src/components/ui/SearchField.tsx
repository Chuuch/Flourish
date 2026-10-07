import { cn } from '@/lib/cn';
import { Search } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';

type SearchFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string;
};

export function SearchField({ label, className, id = 'list-search', ...props }: SearchFieldProps) {
  return (
    <div className="relative min-w-0 max-w-sm">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        className="text-muted pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        aria-hidden="true"
      />
      <input
        id={id}
        type="search"
        className={cn(
          'block w-full rounded-(--radius-control) border border-line bg-control py-2 pr-3 pl-9 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted/55 focus-visible:border-accent focus-visible:shadow-(--focus-ring) disabled:cursor-not-allowed disabled:opacity-55',
          className,
        )}
        {...props}
      />
    </div>
  );
}
