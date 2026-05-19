"use client";
import { FadeInStagger, FadeInItem } from "@/components/motion/fade-in";
import { ModulCard } from "./modul-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useModulList } from "@/hooks/use-modul";

export function ModulList() {
  const { list, loading } = useModulList();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!list.length) {
    return (
      <div className="text-center py-16 text-stone-400 text-sm">
        Belum ada modul. Buat modul pertamamu!
      </div>
    );
  }

  return (
    <FadeInStagger>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((modul) => (
          <FadeInItem key={modul.id}>
            <ModulCard modul={modul} />
          </FadeInItem>
        ))}
      </div>
    </FadeInStagger>
  );
}
