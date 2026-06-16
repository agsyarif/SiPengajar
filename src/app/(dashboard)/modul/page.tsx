import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  BookOpen,
  CheckCircle2,
  FileEdit,
  LoaderCircle,
} from "lucide-react";
import { buttonVariants } from "@/lib/button-variants";
import { FadeIn } from "@/components/motion/fade-in";
import { ModulListClient } from "@/components/modul/modul-list-client";

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

export default async function ModulPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const moduls = await getUserModuls(session.user.id);

  const total = moduls.length;
  type Modul = Awaited<ReturnType<typeof getUserModuls>>[number];
  const done = moduls.filter((m: Modul) => m.status === "DONE").length;
  const draft = moduls.filter((m: Modul) => m.status === "DRAFT").length;
  const processing = moduls.filter((m: Modul) => m.status === "PROCESSING").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold text-stone-900">
              Semua Modul Ajar
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              {total > 0
                ? `${total} modul tersimpan`
                : "Belum ada modul — buat yang pertama!"}
            </p>
          </div>
          <Link href="/modul/baru" className={buttonVariants()}>
            <Plus size={15} />
            Buat Modul Baru
          </Link>
        </div>
      </FadeIn>

      {/* Stats strip */}
      {total > 0 && (
        <FadeIn delay={0.05}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Total Modul",
                value: total,
                icon: BookOpen,
                iconBg: "bg-stone-100",
                iconColor: "text-stone-500",
                valueColor: "text-stone-900",
                bar: null,
              },
              {
                label: "Selesai",
                value: done,
                icon: CheckCircle2,
                iconBg: "bg-teal-50",
                iconColor: "text-teal-600",
                valueColor: "text-teal-700",
                bar: {
                  width: total ? (done / total) * 100 : 0,
                  color: "bg-teal-500",
                },
              },
              {
                label: "Draft",
                value: draft,
                icon: FileEdit,
                iconBg: "bg-violet-50",
                iconColor: "text-violet-600",
                valueColor: "text-violet-600",
                bar: {
                  width: total ? (draft / total) * 100 : 0,
                  color: "bg-violet-400",
                },
              },
              {
                label: "Diproses",
                value: processing,
                icon: LoaderCircle,
                iconBg: "bg-info-bg",
                iconColor: "text-info-bold",
                valueColor: "text-info-bold",
                bar: {
                  width: total ? (processing / total) * 100 : 0,
                  color: "bg-info-bold",
                },
              },
            ].map(
              ({
                label,
                value,
                icon: Icon,
                iconBg,
                iconColor,
                valueColor,
                bar,
              }) => (
                <div
                  key={label}
                  className="bg-white border border-stone-200 rounded-xl px-4 py-3.5 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-500 font-medium">
                      {label}
                    </span>
                    <span
                      className={`flex items-center justify-center w-7 h-7 rounded-lg ${iconBg}`}
                    >
                      <Icon size={14} className={iconColor} />
                    </span>
                  </div>
                  <div>
                    <p
                      className={`text-2xl font-semibold font-display leading-none ${valueColor}`}
                    >
                      {value}
                    </p>
                    {bar && (
                      <div className="mt-2.5 h-1 w-full rounded-full bg-stone-100">
                        <div
                          className={`h-1 rounded-full transition-all duration-500 ${bar.color}`}
                          style={{ width: `${bar.width}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </FadeIn>
      )}

      {/* Client list (search + filter + delete) */}
      <FadeIn delay={0.1}>
        <ModulListClient
          moduls={moduls as Parameters<typeof ModulListClient>[0]["moduls"]}
        />
      </FadeIn>
    </div>
  );
}
