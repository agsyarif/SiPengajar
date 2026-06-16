import { prisma } from "@/lib/prisma";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion/fade-in";
import { LearningPathRail } from "@/components/atp/learning-path-rail";
import { BookOpen, ChevronRight } from "lucide-react";
import type { LearningOutcomeWithChapters } from "@/types";

export default async function ATPPage() {
  const cps = await prisma.learningOutcome.findMany({
    include: {
      elements: true,
      chapters: {
        orderBy: { number: "asc" },
        include: {
          objectives: {
            orderBy: { code: "asc" },
            include: { learningFlow: { orderBy: { sequence: "asc" } } },
          },
        },
      },
    },
    orderBy: { subject: "asc" },
  });

  return (
    <div>
      <FadeIn>
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-stone-400 mb-3">
            <span>Template</span>
            <ChevronRight size={12} />
            <span className="text-stone-600">ATP &amp; TP per CP</span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-stone-900">
            Learning Path — ATP &amp; TP
          </h1>
          <p className="text-sm text-stone-500 mt-1 max-w-lg">
            Contoh jabaran Capaian Pembelajaran (CP) menjadi Alur Tujuan
            Pembelajaran (ATP) dan Tujuan Pembelajaran (TP). Pilih TP yang
            sesuai untuk langsung generate Modul Ajar.
          </p>
        </div>
      </FadeIn>

      {cps.length === 0 && (
        <FadeIn delay={0.06}>
          <div className="text-center py-16 text-stone-400">
            <BookOpen size={36} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium text-stone-500">
              Belum ada data CP tersedia.
            </p>
            <p className="text-xs mt-1">
              Jalankan{" "}
              <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">
                npx prisma db seed
              </code>{" "}
              untuk menambahkan data contoh.
            </p>
          </div>
        </FadeIn>
      )}

      <FadeInStagger staggerDelay={0.08}>
        {cps.map((cp: (typeof cps)[number]) => (
          <FadeInItem key={cp.id}>
            <div className="mb-8">
              <LearningPathRail cp={cp as unknown as LearningOutcomeWithChapters} />
            </div>
          </FadeInItem>
        ))}
      </FadeInStagger>
    </div>
  );
}
