import { cn } from "@/lib/utils";

export default function CheckoutSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("mx-auto flex max-w-3xl flex-col gap-8", className)}>
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="flex gap-6">
        <div className="aspect-square size-40 animate-pulse rounded-xl bg-muted" />
        <div className="flex flex-1 flex-col gap-3">
          <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-5 w-1/4 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="h-12 w-full animate-pulse rounded-lg bg-muted" />
    </div>
  );
}
