import { cn } from "@/lib/utils";

export default function ProductSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl bg-card p-4 shadow-xs ring-1 ring-foreground/10",
        className
      )}
    >
      <div className="aspect-square w-full animate-pulse rounded-lg bg-muted" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
      <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
    </div>
  );
}
