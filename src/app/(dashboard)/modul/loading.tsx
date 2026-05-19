import { Skeleton, ModulCardSkeleton } from "@/components/ui/skeleton";

export default function ModulLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <ModulCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
