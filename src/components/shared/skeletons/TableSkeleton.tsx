import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export default function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: TableSkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex gap-4 pb-2">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={`header-${i}`}
            className="h-4 flex-1 animate-pulse rounded bg-muted"
          />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={`row-${r}`} className="flex gap-4 border-t pt-2">
          {Array.from({ length: columns }).map((_, c) => (
            <div
              key={`cell-${r}-${c}`}
              className="h-3 flex-1 animate-pulse rounded bg-muted/60"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
