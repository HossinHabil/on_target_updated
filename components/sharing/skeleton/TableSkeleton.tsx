import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeleton() {
  return (
    <div className="w-full animate-pulse bg-card my-8 p-4">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-6 w-48 rounded" />
        <Skeleton className="h-8 w-24 rounded" />
      </div>

      <div className="w-full border rounded-lg overflow-hidden">
        <div className="grid grid-cols-4 bg-muted text-muted-foreground p-4">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
        </div>

        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="grid grid-cols-4 items-center p-4 animate-pulse"
            >
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
