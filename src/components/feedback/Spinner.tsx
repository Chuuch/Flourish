interface SpinnerProps {
  className?: string | undefined;
}

export function Spinner({ className = 'size-5' }: SpinnerProps) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-line border-t-ink motion-reduce:animate-none ${className}`}
      aria-hidden="true"
    />
  );
}
