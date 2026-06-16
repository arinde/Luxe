import { cn } from "@/lib/utils";

export default function ProductSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "group relative bg-[#161616] border border-[#2A2A2A] rounded-2xl overflow-hidden flex flex-col",
        className
      )}
    >
      {/* Image container skeleton */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#1F1F1F] animate-pulse" />

      {/* Info skeleton */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Category skeleton */}
        <div className="h-3 w-16 animate-pulse rounded bg-[#2A2A2A]" />
        
        {/* Title skeleton */}
        <div className="h-5 w-3/4 animate-pulse rounded bg-[#2A2A2A]" />
        
        {/* Price + Button skeleton */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="h-5 w-20 animate-pulse rounded bg-[#2A2A2A]" />
          <div className="w-[38px] h-[38px] rounded-[10px] animate-pulse bg-[#2A2A2A]" />
        </div>
      </div>
    </div>
  );
}
