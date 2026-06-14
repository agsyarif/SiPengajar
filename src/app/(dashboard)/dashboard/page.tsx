import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SpringHoverCard } from "@/components/motion/spring-hover";
import { Plus, Sparkles, FileText, Clock } from "lucide-react";
import Link from "next/link";
import { formatDate, getMapelColor } from "@/lib/utils";

async function getRecentModul(_userId: string) {
  return [] as {
    id: string;
    judul: string;
    mapel: string;
    kelas: string;
    alokasi: string;
    status: "DONE" | "DRAFT" | "PROCESSING";
    createdAt: Date;
  }[];
}

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold text-stone-900">
              Selamat datang kembali 👋
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Kamu sudah membuat{" "}
              <span className="text-teal-600 font-medium">3 Modul Ajar</span>{" "}
              bulan ini.
            </p>
          </div>
          <Button asChild>
            <Link href="/modul/baru">
              <Plus size={15} />
              Buat Modul Baru
            </Link>
          </Button>
        </div>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={0.06}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { value: "3", label: "Modul bulan ini", sub: "3 dari 5 tersisa" },
            { value: "2", label: "Draft belum selesai", sub: "Lanjutkan editing" },
            { value: "4", label: "Mapel aktif", sub: "Sejak bergabung" },
          ].map((stat) => (
            <div key={stat.label} className="bg-stone-100 rounded-lg p-4">
              <p className="text-2xl font-semibold font-display text-stone-900">
                {stat.value}
              </p>
              <p className="text-xs font-medium text-stone-700 mt-0.5">
                {stat.label}
              </p>
              <p className="text-2xs text-stone-400 mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Quick action banner */}
      <FadeIn delay={0.1}>
        <div
          className="flex items-center justify-between bg-teal-50 border border-teal-100 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 bg-teal-600 rounded-md flex items-center justify-center flex-shrink-0"
            >
              <Sparkles size={15} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-900">
                Buat Modul Ajar baru sekarang
              </p>
              <p className="text-xs text-stone-500">
                Isi form 2 menit, dapatkan draft lengkap.
              </p>
            </div>
          </div>
          <Button asChild size="sm">
            <Link href="/modul/baru">Mulai →</Link>
          </Button>
        </div>
      </FadeIn>

      {/* Modul terbaru */}
      <div>
        <FadeIn delay={0.14}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-semibold text-stone-900">
              Modul Terbaru
            </h2>
            <Link
              href="/modul"
              className="text-xs text-teal-600 hover:text-teal-800 transition-colors"
            >
              Lihat semua →
            </Link>
          </div>
        </FadeIn>

        <FadeInStagger staggerDelay={0.06}>
          <FadeInItem>
            <div className="text-center py-12 text-stone-400">
              <FileText size={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium text-stone-500">
                Belum ada modul ajar.
              </p>
              <p className="text-xs mt-1">
                Buat modul pertama kamu — hanya butuh 2 menit.
              </p>
              <Button asChild size="sm" className="mt-4">
                <Link href="/modul/baru">
                  <Plus size={13} />
                  Buat Modul Pertama
                </Link>
              </Button>
            </div>
          </FadeInItem>
        </FadeInStagger>
      </div>
    </div>
  );
}

function ModulRow({
  modul,
}: {
  modul: {
    id: string;
    judul: string;
    mapel: string;
    kelas: string;
    alokasi: string;
    status: "DONE" | "DRAFT" | "PROCESSING";
    createdAt: Date;
  };
}) {
  const color = getMapelColor(modul.mapel);
  const statusMap = {
    DONE: { label: "Selesai", variant: "success" },
    DRAFT: { label: "Draft", variant: "warning" },
    PROCESSING: { label: "Proses...", variant: "info" },
  } as const;
  const status = statusMap[modul.status];

  return (
    <SpringHoverCard
      className="bg-white border border-stone-200 rounded-lg px-4 py-3 flex items-center gap-4 cursor-pointer"
    >
      <Badge variant={color} className="flex-shrink-0">
        {modul.mapel}
      </Badge>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-900 truncate">
          {modul.judul}
        </p>
        <p className="text-2xs text-stone-400 mt-0.5 flex items-center gap-1">
          <Clock size={10} />
          {formatDate(modul.createdAt)} · {modul.kelas} · {modul.alokasi}
        </p>
      </div>
      <Badge variant={status.variant}>{status.label}</Badge>
      <div className="flex items-center gap-1.5">
        <Button asChild variant="ghost-stone" size="sm">
          <Link href={`/modul/${modul.id}/edit`}>Edit</Link>
        </Button>
      </div>
    </SpringHoverCard>
  );
}
