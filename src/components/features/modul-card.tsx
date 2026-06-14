import Link from "next/link";
import { SpringHoverCard } from "@/components/motion/spring-hover";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Modul } from "@/types";

const statusVariant = {
  draft: "stone",
  generating: "warning",
  done: "success",
} as const;

export function ModulCard({ modul }: { modul: Modul }) {
  return (
    <SpringHoverCard>
      <Link href={`/modul/${modul.id}/edit`}>
        <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-card cursor-pointer">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-sm font-semibold text-stone-900 line-clamp-2">
              {modul.title}
            </h3>
            <Badge variant={statusVariant[modul.status]}>{modul.status}</Badge>
          </div>
          <p className="text-xs text-stone-500">{modul.topic}</p>
          <p className="text-2xs text-stone-400 mt-3">
            {formatDate(modul.createdAt)}
          </p>
        </div>
      </Link>
    </SpringHoverCard>
  );
}
