import { Skeleton, ModulCardSkeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-stone-100 rounded-lg p-4 space-y-2">
            <Skeleton className="h-7 w-10" />
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Banner */}
      <Skeleton className="h-16 w-full rounded-lg" />

      {/* List */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-32 mb-4" />
        {[...Array(3)].map((_, i) => (
          <ModulCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
