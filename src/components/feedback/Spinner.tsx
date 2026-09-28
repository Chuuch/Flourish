interface SpinnerProps {
  className?: string | undefined;
}

export function Spinner({ className = 'size-5' }: SpinnerProps) {
  return (
    <span
      className={`border-line border-t-accent inline-block animate-spin rounded-full border-2 motion-reduce:animate-none ${className}`}
      aria-hidden="true"
    />
  );
}
