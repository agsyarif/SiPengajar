"use client";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CreditCard,
  Zap,
  Shield,
  AlertTriangle,
  Check,
  ExternalLink,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";

const PLAN_FEATURES = {
  free: [
    "5 Modul Ajar / bulan",
    "Template dasar",
    "Export PDF",
    "Dukungan komunitas",
  ],
  pro: [
    "Modul Ajar tak terbatas",
    "Semua template premium",
    "Export PDF + Word",
    "Dukungan prioritas",
    "Riwayat versi",
    "Kolaborasi tim",
  ],
};

export default function BillingPage() {
  const { data: session } = useSession();
  const plan = (session?.user as { plan?: string })?.plan ?? "free";
  const isPro = plan === "pro";
  const modulUsed = 3;
  const modulLimit = 5;

  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeIn>
        <div>
          <h1 className="font-display text-2xl font-semibold text-stone-900">
            Billing & Langganan
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Kelola paket dan riwayat pembayaran kamu.
          </p>
        </div>
      </FadeIn>

      <FadeInStagger staggerDelay={0.07}>
        {/* Current plan card */}
        <FadeInItem>
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">
                  Paket Saat Ini
                </p>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-xl font-bold text-stone-900">
                    {isPro ? "Pro" : "Gratis"}
                  </h2>
                  <Badge variant={isPro ? "teal" : "stone"}>
                    {isPro ? "Aktif" : "Free tier"}
                  </Badge>
                </div>
                {isPro && (
                  <p className="text-2xs text-stone-400 mt-1">
                    Diperbarui otomatis · 15 Jun 2025
                  </p>
                )}
              </div>
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  isPro ? "bg-teal-50" : "bg-stone-100"
                )}
              >
                {isPro ? (
                  <Zap size={18} className="text-teal-600" />
                ) : (
                  <Shield size={18} className="text-stone-400" />
                )}
              </div>
            </div>

            {/* Usage */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs text-stone-600 mb-2">
                <span>Modul Ajar bulan ini</span>
                <span>
                  <span className="font-semibold text-stone-900">{modulUsed}</span>
                  {!isPro && ` / ${modulLimit}`}
                  {isPro && " · Tak terbatas"}
                </span>
              </div>
              {!isPro && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                  style={{ transformOrigin: "left" }}
                >
                  <Progress value={modulUsed} max={modulLimit} />
                </motion.div>
              )}
              {!isPro && (
                <p className="text-2xs text-stone-400 mt-1.5">
                  {modulLimit - modulUsed} modul tersisa bulan ini. Reset 1 Jun.
                </p>
              )}
            </div>

            {/* Features list */}
            <ul className="space-y-2 border-t border-stone-100 pt-4">
              {(isPro ? PLAN_FEATURES.pro : PLAN_FEATURES.free).map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-stone-600">
                  <Check size={13} className="text-teal-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </FadeInItem>

        {/* Upgrade banner — hidden if Pro */}
        {!isPro && (
          <FadeInItem>
            <div className="bg-violet-600 rounded-xl p-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={16} className="text-violet-200" />
                    <span className="text-xs font-semibold text-violet-200 uppercase tracking-wide">
                      Upgrade ke Pro
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold mb-1">
                    Buka semua fitur premium
                  </h3>
                  <p className="text-sm text-violet-200 max-w-sm leading-relaxed">
                    Modul tak terbatas, template premium, export Word, dan dukungan prioritas. Mulai dari{" "}
                    <span className="text-white font-semibold">Rp 59rb/bulan</span>.
                  </p>
                </div>
                <div className="flex-shrink-0 flex flex-col gap-2 items-end">
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-white text-violet-700 hover:bg-violet-50 whitespace-nowrap"
                    asChild
                  >
                    <Link href="/harga">
                      Lihat Paket →
                    </Link>
                  </Button>
                  <span className="text-2xs text-violet-300">Batalkan kapan saja</span>
                </div>
              </div>
            </div>
          </FadeInItem>
        )}

        {/* Payment history */}
        <FadeInItem>
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Receipt size={15} className="text-stone-400" />
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
                <p className="text-sm font-medium text-stone-500">
                  Belum ada riwayat pembayaran
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Upgrade ke Pro untuk akses semua fitur premium.
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
                  {[
                    { date: "15 Mei 2025", desc: "AjarAI Pro · Bulanan", amount: "Rp 79.000" },
                    { date: "15 Apr 2025", desc: "AjarAI Pro · Bulanan", amount: "Rp 79.000" },
                    { date: "15 Mar 2025", desc: "AjarAI Pro · Bulanan", amount: "Rp 79.000" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-3.5 text-stone-500 text-xs">{row.date}</td>
                      <td className="px-6 py-3.5 text-stone-700 font-medium">{row.desc}</td>
                      <td className="px-6 py-3.5 text-stone-700">{row.amount}</td>
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

        {/* Danger zone */}
        <FadeInItem>
          <div className="border border-stone-200 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-stone-100">
              <AlertTriangle size={15} className="text-stone-400" />
              <h3 className="text-sm font-semibold text-stone-800">Zona Berbahaya</h3>
            </div>
            <div className="px-6 py-5 space-y-4">
              {isPro && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-stone-700">
                      Batalkan langganan
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Kamu tetap bisa menggunakan Pro hingga akhir periode.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="border-stone-300 text-stone-600 hover:border-red-300 hover:text-red-600">
                    Batalkan
                  </Button>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-700">
                    Hapus akun
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Semua data akan dihapus permanen. Tidak bisa dipulihkan.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
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
