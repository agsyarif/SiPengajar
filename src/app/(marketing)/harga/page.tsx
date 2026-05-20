"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { Sparkles, Check, ChevronDown, Zap, ChevronRight } from "lucide-react";
import { SessionProvider, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Period = "bulanan" | "tahunan";

const PLANS = [
  {
    id: "gratis",
    name: "Gratis",
    desc: "Untuk guru yang baru mencoba",
    priceMonthly: 0,
    priceYearly: 0,
    cta: "Mulai Gratis",
    ctaVariant: "outline" as const,
    features: [
      "5 Modul Ajar / bulan",
      "Template dasar",
      "Export PDF",
      "Dukungan komunitas",
    ],
    cardClass: "bg-stone-100 border border-stone-200",
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    desc: "Untuk guru profesional",
    priceMonthly: 79000,
    priceYearly: 59000,
    cta: "Mulai Pro",
    ctaVariant: "primary" as const,
    features: [
      "Modul Ajar tak terbatas",
      "Semua template premium",
      "Export PDF + Word",
      "Dukungan prioritas",
      "Riwayat versi",
      "Kolaborasi tim",
    ],
    cardClass: "bg-white border-2 border-teal-600",
    highlight: true,
    badge: "Paling Populer",
  },
  {
    id: "sekolah",
    name: "Sekolah",
    desc: "Untuk tim guru & institusi",
    priceMonthly: 499000,
    priceYearly: 399000,
    cta: "Hubungi Kami",
    ctaVariant: "outline" as const,
    features: [
      "Semua fitur Pro",
      "Hingga 50 guru",
      "Dashboard admin sekolah",
      "Onboarding khusus",
      "SLA 99.9%",
      "Tagihan terpusat",
    ],
    cardClass: "bg-violet-50 border border-violet-200",
    highlight: false,
  },
];

const FAQS = [
  {
    q: "Apakah saya bisa upgrade atau downgrade kapan saja?",
    a: "Ya, kamu bisa upgrade atau downgrade paket kapan saja. Perubahan berlaku di awal periode tagihan berikutnya. Jika upgrade, selisih biaya akan diperhitungkan secara prorata.",
  },
  {
    q: "Metode pembayaran apa yang diterima?",
    a: "Kami menerima transfer bank, kartu kredit/debit, serta dompet digital seperti GoPay dan OVO. Semua transaksi diproses dengan aman melalui Midtrans.",
  },
  {
    q: "Apakah ada uji coba gratis untuk paket Pro?",
    a: "Paket Gratis sudah bisa kamu gunakan selamanya tanpa kartu kredit. Untuk fitur Pro, kamu bisa upgrade kapan saja dan langsung aktif.",
  },
  {
    q: "Bagaimana dengan paket Sekolah untuk institusi?",
    a: "Paket Sekolah mendukung hingga 50 akun guru dengan satu tagihan terpusat. Hubungi tim kami untuk demo dan penawaran khusus institusi pendidikan.",
  },
  {
    q: "Apakah data saya aman?",
    a: "Data kamu disimpan di server yang berlokasi di Indonesia dengan enkripsi AES-256. Kami tidak pernah menjual atau berbagi data kamu ke pihak ketiga.",
  },
];

function formatPrice(price: number) {
  if (price === 0) return "Gratis";
  return `Rp ${(price / 1000).toFixed(0)}rb`;
}

function HargaPageContent() {
  const [period, setPeriod] = useState<Period>("bulanan");
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="border-b border-stone-100 sticky top-0 bg-white/95 backdrop-blur-sm z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-teal-600 rounded flex items-center justify-center">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="font-display font-semibold text-base text-stone-900">
              SiPengajar
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Button variant="primary" size="sm" asChild>
                <Link href="/dashboard">
                  Dashboard <ChevronRight size={13} />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost-stone" size="sm" asChild>
                  <Link href="/login">Masuk</Link>
                </Button>
                <Button variant="primary" size="sm" asChild>
                  <Link href="/register">Daftar Gratis</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="teal" className="mb-4">
            Harga Transparan
          </Badge>
          <h1 className="font-display text-4xl font-bold text-stone-900 mb-4">
            Pilih paket yang tepat untuk kamu
          </h1>
          <p className="text-stone-500 text-base max-w-md mx-auto">
            Mulai gratis, upgrade kapan saja. Tidak ada biaya tersembunyi.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setPeriod("bulanan")}
              className={cn(
                "text-sm font-medium transition-colors",
                period === "bulanan" ? "text-stone-900" : "text-stone-400",
              )}
            >
              Bulanan
            </button>
            <button
              onClick={() =>
                setPeriod((p) => (p === "bulanan" ? "tahunan" : "bulanan"))
              }
              className={cn(
                "relative w-11 h-6 rounded-full transition-colors",
                period === "tahunan" ? "bg-teal-600" : "bg-stone-200",
              )}
            >
              <motion.div
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                animate={{
                  left: period === "tahunan" ? "calc(100% - 20px)" : "4px",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            </button>
            <button
              onClick={() => setPeriod("tahunan")}
              className={cn(
                "text-sm font-medium transition-colors flex items-center gap-2",
                period === "tahunan" ? "text-stone-900" : "text-stone-400",
              )}
            >
              Tahunan
              <AnimatePresence>
                {period === "tahunan" && (
                  <motion.span
                    key="hemat"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-2xs font-semibold px-1.5 py-0.5 rounded"
                  >
                    <Zap size={10} />
                    Hemat 25%
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {PLANS.map((plan) => {
            const price =
              period === "bulanan" ? plan.priceMonthly : plan.priceYearly;
            return (
              <motion.div
                key={plan.id}
                animate={plan.highlight ? { scale: 1.01 } : { scale: 1 }}
                className={cn(
                  "relative rounded-xl p-6 flex flex-col",
                  plan.cardClass,
                  plan.highlight && "shadow-md",
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-0 right-0 flex justify-center">
                    <span className="bg-teal-600 text-white text-2xs font-semibold px-3 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <p
                    className={cn(
                      "text-xs font-semibold uppercase tracking-wide mb-1",
                      plan.id === "sekolah"
                        ? "text-violet-600"
                        : "text-teal-600",
                    )}
                  >
                    {plan.name}
                  </p>
                  <p className="text-stone-500 text-sm mb-4">{plan.desc}</p>

                  <div className="h-10 flex items-end gap-1">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`${plan.id}-${period}`}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="font-display text-2xl font-bold text-stone-900"
                      >
                        {formatPrice(price)}
                      </motion.span>
                    </AnimatePresence>
                    {price > 0 && (
                      <span className="text-stone-400 text-sm mb-0.5">
                        /bulan
                      </span>
                    )}
                  </div>
                  {period === "tahunan" && price > 0 && (
                    <p className="text-2xs text-stone-400 mt-1">
                      Ditagih tahunan · Hemat Rp{" "}
                      {(((plan.priceMonthly - price) * 12) / 1000).toFixed(0)}
                      rb/tahun
                    </p>
                  )}
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-stone-700"
                    >
                      <Check
                        size={14}
                        className={
                          plan.id === "sekolah"
                            ? "text-violet-500 flex-shrink-0"
                            : "text-teal-500 flex-shrink-0"
                        }
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button variant={plan.ctaVariant} className="w-full" asChild>
                  <Link href={plan.id === "sekolah" ? "#kontak" : "/register"}>
                    {plan.cta}
                  </Link>
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-stone-900 text-center mb-8">
            Pertanyaan umum
          </h2>
          <Accordion.Root type="single" collapsible className="space-y-2">
            {FAQS.map((faq, i) => (
              <Accordion.Item
                key={i}
                value={`faq-${i}`}
                className="border border-stone-200 rounded-lg overflow-hidden"
              >
                <Accordion.Trigger className="group w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-stone-800 hover:bg-stone-50 transition-colors text-left">
                  {faq.q}
                  <ChevronDown
                    size={16}
                    className="text-stone-400 flex-shrink-0 ml-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
                  />
                </Accordion.Trigger>
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                  <p className="px-5 pb-4 text-sm text-stone-500 leading-relaxed">
                    {faq.a}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </main>

      {/* Footer strip */}
      <footer className="border-t border-stone-100 mt-16">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between text-2xs text-stone-400">
          <span>© 2025 SiPengajar · Untuk guru Indonesia</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-stone-600">
              Privasi
            </Link>
            <Link href="#" className="hover:text-stone-600">
              Syarat
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HargaPage() {
  return (
    <SessionProvider>
      <HargaPageContent />
    </SessionProvider>
  );
}
