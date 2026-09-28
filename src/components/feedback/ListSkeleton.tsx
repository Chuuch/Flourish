interface ListSkeletonProps {
  label: string;
  rows?: number | undefined;
}

export function ListSkeleton({ label, rows = 4 }: ListSkeletonProps) {
  return (
    <div role="status">
      <span className="sr-only">{label}</span>
      <ul className="flex flex-col gap-3" aria-hidden="true">
        {Array.from({ length: rows }, (_, index) => (
          <li
            key={index}
            className="bg-line h-11 animate-pulse rounded-lg motion-reduce:animate-none"
          />
        ))}
      </ul>
    </div>
  );
}
