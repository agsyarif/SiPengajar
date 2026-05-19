"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  mapel: z.string().min(1, "Pilih mata pelajaran"),
  jenjang: z.string().min(1, "Pilih jenjang"),
  kelas: z.string().min(1, "Pilih kelas"),
  topik: z.string().min(3, "Topik minimal 3 karakter"),
  tujuan: z.string().min(10, "Tujuan minimal 10 karakter"),
  model: z.string().min(1, "Pilih model pembelajaran"),
  pertemuan: z.number().min(1).max(12),
  menit: z.number().min(30).max(120),
  cp: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const MAPEL_LIST = [
  "Matematika", "IPA", "IPS", "Bahasa Indonesia", "Bahasa Inggris",
  "PPKn", "Seni Budaya", "PJOK", "Informatika", "Prakarya",
];

const FASE_MAP: Record<string, string> = {
  "SD-1": "Fase A", "SD-2": "Fase A",
  "SD-3": "Fase B", "SD-4": "Fase B",
  "SD-5": "Fase C", "SD-6": "Fase C",
  "SMP-7": "Fase D", "SMP-8": "Fase D", "SMP-9": "Fase D",
  "SMA-10": "Fase E",
  "SMA-11": "Fase F", "SMA-12": "Fase F",
};

const PROCESSING_STEPS = [
  "Menganalisis kurikulum dan capaian pembelajaran",
  "Menyusun tujuan pembelajaran terstruktur",
  "Membuat kegiatan pembelajaran (Pendahuluan, Inti, Penutup)",
  "Menyusun asesmen formatif dan sumatif",
  "Finalisasi format Kemendikbud",
];

const selectClass = `w-full h-10 px-3 rounded-md text-sm border bg-white
  text-stone-900 transition-all duration-fast
  focus:outline-none focus:border-teal-600 focus:shadow-focus
  border-stone-200 hover:border-stone-300`;

export default function BuatModulPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showExtra, setShowExtra] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const jenjang = watch("jenjang");
  const kelas = watch("kelas");
  const fase = FASE_MAP[`${jenjang}-${kelas}`] ?? "";

  async function onSubmit(data: FormValues) {
    setSubmitError("");
    setIsProcessing(true);
    setCurrentStep(0);

    try {
      // 1. Buat record modul
      const createRes = await fetch("/api/modul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          judul: `${data.mapel} — ${data.topik}`,
          fase,
        }),
      });
      if (!createRes.ok) throw new Error("Gagal membuat modul.");
      const { data: modul } = await createRes.json();

      // 2. Mulai generate (paralel dengan animasi)
      const generatePromise = fetch(`/api/modul/${modul.id}/generate`, { method: "POST" });

      // 3. Animasi step 1–4 sambil menunggu AI
      for (let i = 0; i < PROCESSING_STEPS.length - 1; i++) {
        await new Promise((r) => setTimeout(r, 3500));
        setCurrentStep(i + 1);
      }

      // 4. Tunggu AI selesai sebelum step terakhir
      const genRes = await generatePromise;
      if (!genRes.ok) throw new Error("Gagal generate konten AI.");

      setCurrentStep(PROCESSING_STEPS.length);
      await new Promise((r) => setTimeout(r, 700));
      router.push(`/modul/${modul.id}/edit`);
    } catch (err) {
      setIsProcessing(false);
      setCurrentStep(0);
      setSubmitError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    }
  }

  if (isProcessing)
    return <ProcessingScreen steps={PROCESSING_STEPS} currentStep={currentStep} />;

  return (
    <div className="max-w-[620px] mx-auto">
      <FadeIn>
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Langkah 1 dari 2 — Informasi Dasar</span>
          </div>
          <div className="h-1 bg-stone-200 rounded-full">
            <div className="h-full w-1/2 bg-teal-600 rounded-full transition-all" />
          </div>
        </div>
        <h1 className="font-display text-xl font-semibold text-stone-900 mb-1">
          Informasi Dasar Modul Ajar
        </h1>
        <p className="text-sm text-stone-500 mb-6">
          Semakin lengkap isian kamu, semakin akurat hasil AI-nya.
        </p>
      </FadeIn>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FadeIn delay={0.06}>
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">

            {/* Section 1 — Identitas */}
            <div>
              <p className="label-section mb-4">Identitas mengajar</p>
              <div className="space-y-4">

                {/* Mapel */}
                <div>
                  <label className="text-xs font-medium text-stone-700 mb-1.5 block">
                    Mata Pelajaran <span className="text-danger-bold">*</span>
                  </label>
                  <select
                    {...register("mapel")}
                    className={cn(selectClass, errors.mapel && "border-danger-bold")}
                  >
                    <option value="">Pilih mata pelajaran...</option>
                    {MAPEL_LIST.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  {errors.mapel && (
                    <p className="text-2xs text-danger-bold mt-1">{errors.mapel.message}</p>
                  )}
                </div>

                {/* Jenjang + Kelas */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-stone-700 mb-1.5 block">
                      Jenjang <span className="text-danger-bold">*</span>
                    </label>
                    <select {...register("jenjang")} className={selectClass}>
                      <option value="">Pilih...</option>
                      {["SD", "SMP", "SMA", "SMK"].map((j) => <option key={j}>{j}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-stone-700 mb-1.5 block">
                      Kelas <span className="text-danger-bold">*</span>
                    </label>
                    <select {...register("kelas")} className={selectClass} disabled={!jenjang}>
                      <option value="">Pilih...</option>
                      {jenjang === "SD" && [1,2,3,4,5,6].map((k) => <option key={k} value={k}>{k}</option>)}
                      {jenjang === "SMP" && [7,8,9].map((k) => <option key={k} value={k}>{k}</option>)}
                      {["SMA","SMK"].includes(jenjang) && [10,11,12].map((k) => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>
                </div>

                {/* Fase otomatis */}
                <AnimatePresence>
                  {fase && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-xs text-stone-500">Fase kurikulum:</span>
                      <Badge variant="teal">{fase}</Badge>
                      <span className="text-2xs text-stone-400">(otomatis terisi)</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Alokasi waktu */}
                <div>
                  <label className="text-xs font-medium text-stone-700 mb-1.5 block">
                    Alokasi Waktu <span className="text-danger-bold">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number" min={1} max={12} defaultValue={2}
                      className="w-16 text-center"
                      {...register("pertemuan", { valueAsNumber: true })}
                    />
                    <span className="text-sm text-stone-500">pertemuan ×</span>
                    <select {...register("menit", { valueAsNumber: true })} className="h-10 px-3 rounded-md text-sm border border-stone-200 bg-white focus:outline-none focus:border-teal-600 focus:shadow-focus">
                      {[30,35,40,45,50,60,80,90].map((m) => <option key={m} value={m}>{m} menit</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-stone-100" />

            {/* Section 2 — Materi */}
            <div>
              <p className="label-section mb-4">Materi ajar</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-stone-700 mb-1.5 block">
                    Topik / Materi Utama <span className="text-danger-bold">*</span>
                  </label>
                  <Input placeholder="Contoh: Persamaan Linear Satu Variabel" {...register("topik")} />
                  {errors.topik && (
                    <p className="text-2xs text-danger-bold mt-1">{errors.topik.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 mb-1.5 block">
                    Tujuan Pembelajaran <span className="text-danger-bold">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Peserta didik dapat... / Siswa mampu..."
                    className={cn(
                      `w-full px-3 py-2.5 rounded-md text-sm border bg-white
                       text-stone-900 placeholder:text-stone-400 resize-none
                       transition-all duration-fast focus:outline-none
                       focus:border-teal-600 focus:shadow-focus`,
                      errors.tujuan ? "border-danger-bold" : "border-stone-200 hover:border-stone-300",
                    )}
                    {...register("tujuan")}
                  />
                  {errors.tujuan && (
                    <p className="text-2xs text-danger-bold mt-1">{errors.tujuan.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 mb-1.5 block">
                    Model Pembelajaran <span className="text-danger-bold">*</span>
                  </label>
                  <select {...register("model")} className={selectClass}>
                    <option value="">Pilih model...</option>
                    {[
                      "Tatap Muka",
                      "PBL (Project-Based Learning)",
                      "DI (Discovery Learning)",
                      "Kooperatif",
                      "Kontekstual (CTL)",
                    ].map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Collapsible extra */}
            <div>
              <button
                type="button"
                onClick={() => setShowExtra(!showExtra)}
                className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 transition-colors"
              >
                <ChevronDown
                  size={13}
                  className={cn("transition-transform duration-fast", showExtra && "rotate-180")}
                />
                Informasi tambahan (opsional)
              </button>

              <AnimatePresence>
                {showExtra && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-4 overflow-hidden"
                  >
                    <div>
                      <label className="text-xs font-medium text-stone-700 mb-1.5 block">
                        Capaian Pembelajaran (CP)
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Paste CP dari Kemendikbud, atau biarkan AI yang mengisi..."
                        className="w-full px-3 py-2.5 rounded-md text-sm border border-stone-200 bg-white placeholder:text-stone-400 resize-none focus:outline-none focus:border-teal-600 focus:shadow-focus hover:border-stone-300 transition-all"
                        {...register("cp")}
                      />
                      <p className="text-2xs text-stone-400 mt-1">
                        Kosongkan jika tidak yakin — AI akan mengisi dari database kurikulum.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </FadeIn>

        {/* Sticky bottom CTA */}
        <div className="sticky bottom-0 bg-stone-50 border-t border-stone-200 -mx-8 px-8 py-4 mt-6 flex items-center justify-between">
          <p className="text-xs text-stone-400">
            Field bertanda <span className="text-danger-bold">*</span> wajib diisi
          </p>
          <div className="flex items-center gap-2">
            {submitError && (
              <p className="text-xs text-danger-bold">{submitError}</p>
            )}
            <Button variant="ghost" size="md" type="button">Batal</Button>
            <Button type="submit" size="md" disabled={!isValid} className="gap-1.5">
              <Sparkles size={14} />
              Generate Modul Ajar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

function ProcessingScreen({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  return (
    <div className="max-w-[480px] mx-auto pt-16">
      <FadeIn>
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <Sparkles size={22} className="text-white" />
            </motion.div>
          </div>
          <h2 className="font-display text-lg font-semibold text-stone-900">
            AI sedang menyusun modul kamu...
          </h2>
          <p className="text-sm text-stone-500 mt-1">Biasanya selesai dalam 15–30 detik.</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3">
          {steps.map((step, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            return (
              <motion.div
                key={step}
                className="flex items-center gap-3"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: done || active ? 1 : 0.35 }}
              >
                <div className="w-5 h-5 flex-shrink-0">
                  {done ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                      <CheckCircle2 size={18} className="text-teal-600" />
                    </motion.div>
                  ) : active ? (
                    <div className="w-4 h-4 rounded-full border-2 border-teal-600 border-t-transparent animate-spin mt-0.5" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-stone-300 mt-0.5" />
                  )}
                </div>
                <p className={cn(
                  "text-sm",
                  done ? "text-stone-600 line-through" : "text-stone-800",
                  active && "font-medium text-teal-600",
                )}>
                  {step}
                </p>
              </motion.div>
            );
          })}
        </div>
      </FadeIn>
    </div>
  );
}
