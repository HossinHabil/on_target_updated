import { Skeleton } from "../../ui/skeleton";

export default function PaymentMethodsSkeletonCards() {
  return (
    <div className="max-w-[50rem] mx-auto w-full flex flex-col gap-8 lg:flex-row">
      <PaymentMethodsSkeletonCard />
      <PaymentMethodsSkeletonCard />
    </div>
  );
}

function PaymentMethodsSkeletonCard() {
  return (
    <div className="w-full flex flex-col gap-5 items-center animate-pulse space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <Skeleton className="h-24 w-[250px]" />
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[250px]" />
    </div>
  );
}
