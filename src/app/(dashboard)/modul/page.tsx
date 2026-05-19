import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, FileText, Clock, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/lib/button-variants";
import { Badge } from "@/components/ui/badge";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion/fade-in";
import { SpringHoverCard } from "@/components/motion/spring-hover";
import { formatRelative, getMapelColor } from "@/lib/utils";

async function getUserModuls(userId: string) {
  return prisma.modul.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      judul: true,
      mapel: true,
      jenjang: true,
      kelas: true,
      fase: true,
      status: true,
      pertemuan: true,
      menit: true,
      updatedAt: true,
    },
  });
}

const STATUS_MAP = {
  DONE:       { label: "Selesai",  variant: "success"  },
  DRAFT:      { label: "Draft",    variant: "warning"  },
  PROCESSING: { label: "Proses…",  variant: "info"     },
} as const;

export default async function ModulPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const moduls = await getUserModuls(session.user.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-stone-900">
              Semua Modul Ajar
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              {moduls.length > 0
                ? `${moduls.length} modul tersimpan`
                : "Belum ada modul — buat yang pertama!"}
            </p>
          </div>
          <Link href="/modul/baru" className={buttonVariants()}>
            <Plus size={15} />
            Buat Modul Baru
          </Link>
        </div>
      </FadeIn>

      {/* Empty state */}
      {moduls.length === 0 && (
        <FadeIn delay={0.08}>
          <div className="text-center py-20 text-stone-400">
            <FileText size={36} className="mx-auto mb-4 opacity-30" />
            <p className="text-sm font-medium text-stone-500 mb-1">
              Belum ada modul ajar.
            </p>
            <p className="text-xs mb-5">
              Buat modul pertama kamu — hanya butuh 2 menit.
            </p>
            <Link href="/modul/baru" className={buttonVariants({ size: "sm" })}>
              <Plus size={13} />
              Buat Sekarang
            </Link>
          </div>
        </FadeIn>
      )}

      {/* List */}
      {moduls.length > 0 && (
        <FadeInStagger staggerDelay={0.05}>
          {moduls.map((modul) => {
            const color = getMapelColor(modul.mapel);
            const status = STATUS_MAP[modul.status as keyof typeof STATUS_MAP];
            return (
              <FadeInItem key={modul.id}>
                <SpringHoverCard className="bg-white border border-stone-200 rounded-lg px-4 py-3.5 flex items-center gap-4">
                  {/* Mapel badge */}
                  <Badge variant={color} className="flex-shrink-0 min-w-[72px] justify-center">
                    {modul.mapel}
                  </Badge>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 truncate">
                      {modul.judul}
                    </p>
                    <p className="text-2xs text-stone-400 mt-0.5 flex items-center gap-1.5" suppressHydrationWarning>
                      <Clock size={10} />
                      {formatRelative(modul.updatedAt)}
                      <span className="text-stone-300">·</span>
                      {modul.jenjang} Kelas {modul.kelas}
                      <span className="text-stone-300">·</span>
                      {modul.fase}
                      <span className="text-stone-300">·</span>
                      {modul.pertemuan}×{modul.menit} mnt
                    </p>
                  </div>

                  {/* Status */}
                  <Badge variant={status.variant}>{status.label}</Badge>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button asChild variant="ghost-stone" size="sm">
                      <Link href={`/modul/${modul.id}/edit`}>
                        <Pencil size={13} />
                        Edit
                      </Link>
                    </Button>
                  </div>
                </SpringHoverCard>
              </FadeInItem>
            );
          })}
        </FadeInStagger>
      )}
    </div>
  );
}
