import { cn } from "@/lib/utils";

function Shimmer({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-muted", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-3">
      <Shimmer className="h-4 w-1/3" />
      <Shimmer className="h-8 w-1/2" />
      <Shimmer className="h-3 w-2/3" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted/50 px-4 py-3 flex gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Shimmer key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-4 py-3 flex gap-4 border-t">
          {[1, 2, 3, 4].map((j) => (
            <Shimmer key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Shimmer className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Shimmer className="h-6 w-48" />
          <Shimmer className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Shimmer className="h-4 w-24" />
            <Shimmer className="h-8 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Shimmer className="h-8 w-64" />
        <Shimmer className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <TableSkeleton />
    </div>
  );
}
