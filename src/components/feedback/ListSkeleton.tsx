interface ListSkeletonProps {
  label: string;
  rows?: number | undefined;
}

export function ListSkeleton({ label, rows = 4 }: ListSkeletonProps) {
  return (
    <div role="status">
      <span className="sr-only">{label}</span>
      <ul className="stack-list" aria-hidden="true">
        {Array.from({ length: rows }, (_, index) => (
          <li key={index} className="!py-3">
            <div className="flex flex-col gap-2">
              <div className="bg-line h-3 w-2/5 animate-pulse rounded motion-reduce:animate-none" />
              <div className="bg-line h-3 w-4/5 animate-pulse rounded motion-reduce:animate-none" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
