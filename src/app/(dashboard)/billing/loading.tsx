import { Skeleton } from "@/components/ui/skeleton";

export default function BillingLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Plan card */}
      <div className="border border-stone-200 rounded-xl p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
        <div className="space-y-2 pt-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full max-w-xs" />
          ))}
        </div>
      </div>

      {/* History table */}
      <div className="border border-stone-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="divide-y divide-stone-100">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="px-6 py-3.5 flex gap-8">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-5 w-14 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
