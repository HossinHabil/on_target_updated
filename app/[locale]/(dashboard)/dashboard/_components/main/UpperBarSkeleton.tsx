import TableSkeleton from "@/components/sharing/skeleton/TableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function UpperBarSkeleton() {
  return (
    <div className="w-full space-y-10">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8 w-full">
        <UpperBarItemSkeleton />
        <UpperBarItemSkeleton />
      </section>
      <section>
        <TableSkeleton />
      </section>
    </div>
  );
}

function UpperBarItemSkeleton() {
  return (
    <div className="flex gap-4 animate-pulse bg-card px-8 py-4 shadow-sm rounded-lg">
      <div className="p-4 rounded-full">
        <Skeleton className="size-12 rounded-full" />
      </div>
      <div className="space-y-4 flex flex-col justify-center">
        <Skeleton className="h-4 w-40 rounded" />
        <Skeleton className="h-4 w-40 rounded" />
      </div>
    </div>
  );
}
