"use client";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CreditCard,
  Zap,
  AlertTriangle,
  Check,
  Minus,
  ExternalLink,
  Receipt,
  BarChart2,
  Sparkles,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FadeInStagger, FadeInItem } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";

const FREE_FEATURES: { label: string; included: boolean }[] = [
  { label: "3 Modul Ajar / bulan", included: true },
  { label: "Template dasar", included: true },
  { label: "Export PDF", included: true },
  { label: "Dukungan komunitas", included: true },
  { label: "Template premium", included: false },
  { label: "Export Word", included: false },
  { label: "Modul tak terbatas", included: false },
  { label: "Dukungan prioritas", included: false },
];

const PRO_FEATURES: { label: string }[] = [
  { label: "Modul Ajar tak terbatas" },
  { label: "Semua template premium" },
  { label: "Export PDF + Word" },
  { label: "Dukungan prioritas" },
  { label: "Riwayat versi" },
  { label: "Kolaborasi tim" },
  { label: "Analytics modul" },
  { label: "Akses API" },
];

const PAYMENT_HISTORY = [
  { date: "15 Mei 2025", desc: "AjarAI Pro · Bulanan", amount: "Rp 79.000" },
  { date: "15 Apr 2025", desc: "AjarAI Pro · Bulanan", amount: "Rp 79.000" },
  { date: "15 Mar 2025", desc: "AjarAI Pro · Bulanan", amount: "Rp 79.000" },
];

export default function BillingPage() {
  const { data: session } = useSession();
  const plan = (session?.user as { plan?: string })?.plan ?? "free";
  const isPro = plan === "pro" || plan === "PRO";
  const modulUsed = 2;
  const modulLimit = 3;
  const usagePct = (modulUsed / modulLimit) * 100;
  const isWarning = usagePct >= 80;

  return (
    <div>
      <FadeInStagger staggerDelay={0.06} className="space-y-6">
        <FadeInItem>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-semibold text-stone-900">
                Billing & Langganan
              </h1>
              <p className="text-sm text-stone-500 mt-0.5">
                Kelola paket dan riwayat pembayaran kamu.
              </p>
            </div>
            <Badge
              variant={isPro ? "violet" : "stone"}
              className="text-xs px-3 py-1"
            >
              {isPro ? "✦ Pro" : "Free Tier"}
            </Badge>
          </div>
        </FadeInItem>

        {/* ── Stats Strip ── */}
        <FadeInItem>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                label: "Paket Aktif",
                value: isPro ? "Pro" : "Gratis",
                accent: isPro,
                icon: (
                  <Sparkles
                    size={14}
                    className={isPro ? "text-violet-500" : "text-stone-400"}
                  />
                ),
              },
              {
                label: "Modul Bulan Ini",
                value: isPro
                  ? `${modulUsed} modul`
                  : `${modulUsed} / ${modulLimit}`,
                accent: false,
                icon: <BarChart2 size={14} className="text-teal-500" />,
              },
              {
                label: "Aktif Sejak",
                value: "Mar 2025",
                accent: false,
                icon: <CalendarDays size={14} className="text-stone-400" />,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-stone-200 rounded-lg px-4 py-3 flex items-center gap-3"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-md flex items-center justify-center shrink-0",
                    stat.accent ? "bg-violet-50" : "bg-stone-50",
                  )}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xs text-stone-400 mb-0.5">{stat.label}</p>
                  <p
                    className={cn(
                      "font-display text-lg leading-none font-medium",
                      stat.accent ? "text-violet-700" : "text-stone-900",
                    )}
                  >
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FadeInItem>

        {/* ── Plan Cards ── */}
        <FadeInItem>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Free Card */}
            <div
              className={cn(
                "bg-white border rounded-xl p-5 flex flex-col",
                !isPro
                  ? "border-teal-300 ring-1 ring-teal-100"
                  : "border-stone-200",
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-2xs text-stone-400 uppercase tracking-wide mb-1">
                    Paket
                  </p>
                  <h3 className="font-display text-xl text-stone-900">
                    Gratis
                  </h3>
                </div>
                <div className="text-right">
                  <Badge variant="stone">Free</Badge>
                  <p className="text-2xs text-stone-400 mt-1.5">Rp 0/bulan</p>
                </div>
              </div>

              <ul className="space-y-2.5 flex-1">
                {FREE_FEATURES.map((f) => (
                  <li key={f.label} className="flex items-center gap-2 text-sm">
                    {f.included ? (
                      <Check size={13} className="text-teal-500 shrink-0" />
                    ) : (
                      <Minus size={13} className="text-stone-300 shrink-0" />
                    )}
                    <span
                      className={
                        f.included ? "text-stone-700" : "text-stone-400"
                      }
                    >
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-4 border-t border-stone-100">
                {!isPro ? (
                  <div className="flex items-center gap-1.5 text-xs text-teal-700 font-medium">
                    <Check size={12} className="text-teal-500" />
                    Paket Aktif
                  </div>
                ) : (
                  <p className="text-2xs text-stone-400">
                    Downgrade tersedia kapan saja
                  </p>
                )}
              </div>
            </div>

            {/* Pro Card */}
            <div
              className={cn(
                "border rounded-xl overflow-hidden flex flex-col",
                isPro
                  ? "border-violet-300 ring-1 ring-violet-100"
                  : "border-violet-200",
              )}
            >
              {/* Gradient header band */}
              <div className="bg-linear-to-br from-violet-600 to-violet-500 px-5 pt-5 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Zap size={13} className="text-violet-200" />
                      <p className="text-2xs text-violet-200 uppercase tracking-wide font-semibold">
                        Premium
                      </p>
                    </div>
                    <h3 className="font-display text-xl text-white">Pro</h3>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="dark"
                      className="bg-violet-900/40 text-violet-100 border-0"
                    >
                      {isPro ? "Aktif" : "Populer"}
                    </Badge>
                    <p className="text-2xs text-violet-300 mt-1.5">
                      Rp 59rb/bulan
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 flex flex-col flex-1">
                <ul className="space-y-2.5 flex-1">
                  {PRO_FEATURES.map((f) => (
                    <li
                      key={f.label}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check size={13} className="text-teal-500 shrink-0" />
                      <span className="text-stone-700">{f.label}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 pt-4 border-t border-stone-100">
                  {isPro ? (
                    <div className="flex items-center gap-1.5 text-xs text-violet-700 font-medium">
                      <Zap size={12} className="text-violet-500" />
                      Paket Aktif · Diperbarui 15 Jun 2025
                    </div>
                  ) : (
                    <Button variant="pro" size="sm" className="w-full" asChild>
                      <Link href="/harga">
                        <Sparkles size={13} />
                        Upgrade Sekarang →
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </FadeInItem>

        {/* ── Usage Card (Free only) ── */}
        {!isPro && (
          <FadeInItem>
            <div
              className={cn(
                "bg-white border rounded-xl px-5 py-4",
                isWarning
                  ? "border-amber-200 bg-amber-50/40"
                  : "border-stone-200",
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BarChart2
                    size={14}
                    className={isWarning ? "text-amber-500" : "text-stone-400"}
                  />
                  <span className="text-sm font-medium text-stone-800">
                    Penggunaan Bulan Ini
                  </span>
                </div>
                {isWarning && <Badge variant="warning">Hampir habis</Badge>}
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <span>
                  {modulUsed} dari {modulLimit} modul digunakan
                </span>
                <span className="font-semibold text-stone-800">
                  {Math.round(usagePct)}%
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
                style={{ transformOrigin: "left" }}
              >
                <Progress value={modulUsed} max={modulLimit} />
              </motion.div>

              <p className="text-2xs text-stone-400 mt-2">
                {modulLimit - modulUsed} modul tersisa bulan ini · Reset 1 Jun
                2025
              </p>
            </div>
          </FadeInItem>
        )}

        {/* ── Payment History ── */}
        <FadeInItem>
          <div className="bg-white border border-stone-200 rounded-xl overflow-x-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Receipt size={14} className="text-stone-400" />
                <h3 className="text-sm font-semibold text-stone-800">
                  Riwayat Pembayaran
                </h3>
              </div>
              {isPro && (
                <Button variant="ghost-stone" size="sm">
                  <ExternalLink size={13} />
                  Kelola di portal
                </Button>
              )}
            </div>

            {!isPro ? (
              <div className="px-6 py-12 text-center">
                <CreditCard size={28} className="mx-auto mb-3 text-stone-200" />
                <p className="text-sm font-medium text-stone-500 mb-1">
                  Belum ada riwayat pembayaran
                </p>
                <p className="text-xs text-stone-400 max-w-xs mx-auto">
                  Upgrade ke Pro untuk mengakses semua fitur premium dan riwayat
                  transaksi.
                </p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 text-2xs font-semibold text-stone-500 uppercase tracking-wide">
                    <th className="px-6 py-3 text-left">Tanggal</th>
                    <th className="px-6 py-3 text-left">Deskripsi</th>
                    <th className="px-6 py-3 text-left">Jumlah</th>
                    <th className="px-6 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {PAYMENT_HISTORY.map((row, i) => (
                    <tr key={i} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-3.5 text-xs text-stone-500">
                        {row.date}
                      </td>
                      <td className="px-6 py-3.5 text-stone-700 font-medium">
                        {row.desc}
                      </td>
                      <td className="px-6 py-3.5 text-stone-700">
                        {row.amount}
                      </td>
                      <td className="px-6 py-3.5">
                        <Badge variant="success">Lunas</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </FadeInItem>

        {/* ── Danger Zone ── */}
        <FadeInItem>
          <div className="border border-stone-200 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-stone-100 bg-stone-50/60">
              <AlertTriangle size={14} className="text-stone-400" />
              <h3 className="text-sm font-semibold text-stone-700">
                Zona Berbahaya
              </h3>
            </div>
            <div className="px-6 py-5 space-y-4 bg-white">
              {isPro && (
                <div className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-sm font-medium text-stone-700">
                      Batalkan langganan
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Kamu tetap bisa menggunakan Pro hingga akhir periode
                      tagihan.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-stone-300 text-stone-600 hover:border-red-300 hover:text-red-600 shrink-0"
                  >
                    Batalkan
                  </Button>
                </div>
              )}
              {isPro && <div className="border-t border-stone-100" />}
              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-medium text-stone-700">
                    Hapus akun
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Semua data dihapus permanen dan tidak bisa dipulihkan.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 shrink-0"
                >
                  Hapus Akun
                </Button>
              </div>
            </div>
          </div>
        </FadeInItem>
      </FadeInStagger>
    </div>
  );
}
