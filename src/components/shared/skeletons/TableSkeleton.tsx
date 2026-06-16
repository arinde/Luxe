import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export default function TableSkeleton({
  rows = 8,
  columns = 9,
  className,
}: TableSkeletonProps) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full">
        {/* Header Skeleton */}
        <thead>
          <tr className="border-b border-[#2A2A2A]">
            {Array.from({ length: columns }).map((_, i) => (
              <th
                key={`header-${i}`}
                className="text-left py-4 px-4"
              >
                <div className="h-3 w-20 animate-pulse rounded bg-[#2A2A2A]" />
              </th>
            ))}
          </tr>
        </thead>
        
        {/* Body Skeleton */}
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr
              key={`row-${r}`}
              className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A]/50 transition-colors"
            >
              {Array.from({ length: columns }).map((_, c) => {
                // Vary the width of skeletons to look more realistic
                const widths = ['w-8', 'w-32', 'w-20', 'w-24', 'w-24', 'w-20', 'w-16', 'w-16', 'w-20'];
                const width = widths[c] || 'w-20';
                
                return (
                  <td key={`cell-${r}-${c}`} className="py-4 px-4">
                    <div
                      className={cn(
                        "h-3 animate-pulse rounded bg-[#2A2A2A]/60",
                        width
                      )}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
