import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
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

  const total      = moduls.length;
  const done       = moduls.filter((m) => m.status === "DONE").length;
  const draft      = moduls.filter((m) => m.status === "DRAFT").length;
  const processing = moduls.filter((m) => m.status === "PROCESSING").length;

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
              {total > 0 ? `${total} modul tersimpan` : "Belum ada modul — buat yang pertama!"}
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
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Total",   value: total,      accent: false },
              { label: "Selesai", value: done,        accent: true  },
              { label: "Draft",   value: draft,       accent: false },
              { label: "Proses",  value: processing,  accent: false },
            ].map(({ label, value, accent }) => (
              <div
                key={label}
                className="bg-white border border-stone-200 rounded-lg px-3 py-2.5 text-center"
              >
                <p className={`text-xl font-semibold font-display ${accent ? "text-teal-600" : "text-stone-900"}`}>
                  {value}
                </p>
                <p className="text-2xs text-stone-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      )}

      {/* Client list (search + filter + delete) */}
      <FadeIn delay={0.1}>
        <ModulListClient moduls={moduls as Parameters<typeof ModulListClient>[0]["moduls"]} />
      </FadeIn>
    </div>
  );
}
