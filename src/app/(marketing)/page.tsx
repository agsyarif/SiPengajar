"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SpringHoverCard } from "@/components/motion/spring-hover";
import {
  Sparkles, FileText, Download, CheckCircle2,
  Star, BookOpen, Zap, Layers, GraduationCap,
  ChevronRight, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Scroll reveal ────────────────────────────────────────
function ScrollReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Wavy underline ───────────────────────────────────────
function WavyUnderline({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      {children}
      <svg
        aria-hidden
        className="absolute -bottom-1.5 left-0 w-full overflow-visible"
        height="8"
        viewBox="0 0 100 8"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 5 C12 1, 22 7, 33 5 C44 2, 55 7, 66 5 C77 2, 88 7, 100 5"
          stroke="#0F6E56"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

// ── Hero mockup card ─────────────────────────────────────
function HeroMockupCard() {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      className="bg-white rounded-2xl border border-stone-200 shadow-modal p-5 w-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-2xs text-stone-400 font-medium uppercase tracking-wide">
            Modul Ajar · Kelas 7 SMP
          </p>
          <p className="text-sm font-semibold text-stone-900 mt-0.5">
            Persamaan Linear Satu Variabel
          </p>
        </div>
        <Badge variant="success">Done</Badge>
      </div>

      <div className="space-y-0 mb-4">
        {[
          { label: "Mata Pelajaran", value: "Matematika" },
          { label: "Fase / Kelas", value: "Fase D · Kelas 7" },
          { label: "Alokasi Waktu", value: "2 × 40 menit" },
          { label: "Model Pembelajaran", value: "Discovery Learning" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between py-1.5 border-b border-stone-100 last:border-0"
          >
            <span className="text-2xs text-stone-400">{label}</span>
            <span className="text-xs font-medium text-stone-700">{value}</span>
          </div>
        ))}
      </div>

      <div className="bg-stone-50 rounded-lg p-3">
        <p className="text-2xs font-medium text-stone-400 mb-1.5 uppercase tracking-wide">
          Tujuan Pembelajaran
        </p>
        <p className="text-xs text-stone-700 leading-relaxed">
          Peserta didik dapat memahami konsep persamaan linear satu variabel
          dan menyelesaikan permasalahan...
        </p>
        <p className="text-xs text-stone-700 mt-1 flex items-center">
          menerapkan dalam konteks nyata
          <motion.span
            className="inline-block w-0.5 h-3.5 bg-teal-600 ml-0.5"
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.9, ease: [0, 0, 1, 1] }}
          />
        </p>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <div className="flex-1 h-1 bg-stone-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-teal-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, delay: 0.4, ease: "easeOut" }}
          />
        </div>
        <span className="text-2xs text-teal-600 font-medium">100%</span>
      </div>
    </motion.div>
  );
}

// ── Navbar ───────────────────────────────────────────────
function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-teal-600 rounded flex items-center justify-center">
            <Sparkles size={13} className="text-white" />
          </div>
          <span className="font-display font-semibold text-base text-stone-900">AjarAI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {[
            { label: "Cara Kerja", href: "#how-it-works" },
            { label: "Fitur", href: "#features" },
            { label: "Harga", href: "#pricing" },
            { label: "Template", href: "#templates" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Masuk</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">
              Coba Gratis
              <ChevronRight size={13} />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

// ── Hero ─────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden bg-stone-50 min-h-[calc(100vh-56px)] flex flex-col justify-center">
      {/* Dot grid background */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage: "radial-gradient(circle, #C8C8C2 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Radial fade — focuses eye to center */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 40%, #FAFAF9 100%)",
        }}
      />
      {/* Bottom fade into next section */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stone-50 to-transparent"
      />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-6 py-16 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              <Badge variant="teal" className="mb-5">
                <Sparkles size={10} className="mr-1" />
                Untuk Guru SD · SMP · SMA Indonesia
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 26, delay: 0.05 }}
              className="font-display text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.1] tracking-tight mb-5"
            >
              Buat Modul Ajar
              <br />
              dalam{" "}
              <WavyUnderline>hitungan detik</WavyUnderline>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 26, delay: 0.1 }}
              className="text-lg text-stone-500 mb-9 leading-relaxed max-w-md"
            >
              AjarAI membantu guru membuat Modul Ajar Kurikulum Merdeka yang lengkap,
              terstruktur, dan siap pakai — hanya dengan mengisi form 2 menit.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex items-center gap-3 flex-wrap mb-10"
            >
              <Button asChild size="lg" className="relative overflow-hidden">
                <Link href="/register">
                  <motion.div
                    aria-hidden
                    className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                    animate={{ x: ["-150%", "250%"] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear", repeatDelay: 2 }}
                  />
                  <Sparkles size={15} className="relative z-10" />
                  <span className="relative z-10">Coba Gratis</span>
                </Link>
              </Button>
              <Button asChild variant="ghost-stone" size="lg">
                <Link href="#how-it-works">Lihat cara kerja →</Link>
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {(["#0F6E56", "#534AB7", "#1D9E75", "#633806"] as const).map((bg, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-stone-50 flex items-center justify-center text-2xs font-bold text-white"
                    style={{ backgroundColor: bg }}
                  >
                    {["A", "B", "C", "D"][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-2xs text-stone-500">
                  Dipercaya{" "}
                  <span className="font-semibold text-stone-700">2.400+ guru</span>{" "}
                  di seluruh Indonesia
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right — mockup card */}
          <motion.div
            initial={{ opacity: 0, x: 24, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28, delay: 0.1 }}
            className="lg:pl-4"
          >
            <HeroMockupCard />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <span className="text-2xs text-stone-400 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-stone-400 to-transparent"
        />
      </motion.div>
    </section>
  );
}

// ── How It Works ─────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      title: "Isi Form",
      desc: "Masukkan mata pelajaran, jenjang, kelas, topik, dan tujuan pembelajaran. Hanya 2 menit.",
      icon: FileText,
    },
    {
      title: "AI Generate",
      desc: "Dalam 15–30 detik, AI menyusun modul ajar lengkap sesuai format Kemendikbud.",
      icon: Sparkles,
    },
    {
      title: "Edit & Export",
      desc: "Edit langsung di browser dengan editor built-in, lalu download PDF atau Word.",
      icon: Download,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <Badge variant="stone" className="mb-3">Cara Kerja</Badge>
          <h2 className="font-display text-3xl font-bold text-stone-900">
            Tiga langkah sederhana
          </h2>
          <p className="text-stone-500 text-sm mt-2 max-w-md mx-auto">
            Dari form kosong ke modul ajar siap pakai dalam waktu kurang dari semenit.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connector lines */}
          <div
            aria-hidden
            className="absolute top-7 left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-px bg-stone-200 hidden md:block"
          />
          {steps.map((step, i) => (
            <ScrollReveal key={step.title} delay={i * 0.08}>
              <div className="text-center">
                <div className="relative inline-flex mb-4">
                  <div className="w-14 h-14 rounded-xl bg-teal-50 flex items-center justify-center">
                    <step.icon size={22} className="text-teal-600" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-teal-600 text-white text-2xs font-bold rounded-full flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-base text-stone-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Features ─────────────────────────────────────────────
function Features() {
  const features = [
    { icon: CheckCircle2, title: "Format Kemendikbud", desc: "Otomatis sesuai komponen wajib: identitas, CP, TP, ATP, kegiatan pembelajaran, dan asesmen.", accent: true },
    { icon: BookOpen, title: "Kurikulum Merdeka", desc: "Memahami fase, elemen, dan dimensi Profil Pelajar Pancasila secara mendalam.", accent: true },
    { icon: FileText, title: "Editor Built-in", desc: "Edit langsung di browser — bold, bullet, heading, tanpa perlu Word atau Google Docs.", accent: false },
    { icon: Download, title: "Export PDF & Word", desc: "Download satu klik. File .pdf dan .docx siap cetak dan dikirim ke kepala sekolah.", accent: false },
    { icon: Zap, title: "Generate dalam 30 Detik", desc: "Dari form ke modul lengkap dalam hitungan detik. Bukan jam, bukan hari.", accent: true },
    { icon: Layers, title: "Semua Mata Pelajaran", desc: "IPA, IPS, Matematika, Bahasa Indonesia, Bahasa Inggris — semua mapel SD hingga SMA.", accent: false },
  ];

  return (
    <section id="features" className="py-20 bg-stone-50">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <Badge variant="stone" className="mb-3">Fitur</Badge>
          <h2 className="font-display text-3xl font-bold text-stone-900">
            Semua yang kamu butuhkan
          </h2>
          <p className="text-stone-500 text-sm mt-2 max-w-md mx-auto">
            Dirancang khusus untuk guru Indonesia, dari pengisian form hingga dokumen final.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feat, i) => (
            <ScrollReveal key={feat.title} delay={i * 0.05}>
              <SpringHoverCard className="bg-white border border-stone-200 rounded-xl p-5 h-full block">
                <div
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center mb-3",
                    feat.accent ? "bg-teal-50" : "bg-stone-100"
                  )}
                >
                  <feat.icon
                    size={18}
                    className={feat.accent ? "text-teal-600" : "text-stone-500"}
                  />
                </div>
                <h3 className="font-display font-semibold text-sm text-stone-900 mb-1">
                  {feat.title}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">{feat.desc}</p>
              </SpringHoverCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Pricing ───────────────────────────────────────────────
function Pricing() {
  const plans = [
    {
      name: "Gratis",
      price: "Rp 0",
      period: "selamanya",
      desc: "Untuk mencoba AjarAI",
      features: ["5 modul per bulan", "Format standar Kemendikbud", "Export PDF", "Editor built-in"],
      cta: "Mulai Gratis",
      variant: "outline" as const,
      highlight: false,
      popular: false,
    },
    {
      name: "Pro",
      price: "Rp 79.000",
      period: "per bulan",
      desc: "Untuk guru aktif",
      features: ["Modul tak terbatas", "Export PDF + Word (.docx)", "Template premium", "Prioritas generate", "Riwayat modul"],
      cta: "Mulai Pro",
      variant: "primary" as const,
      highlight: true,
      popular: true,
    },
    {
      name: "Sekolah",
      price: "Rp 499.000",
      period: "per bulan",
      desc: "Untuk tim guru & sekolah",
      features: ["Hingga 20 guru", "Dashboard admin", "Laporan penggunaan", "Branding sekolah", "Dukungan prioritas"],
      cta: "Hubungi Kami",
      variant: "pro" as const,
      highlight: false,
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <Badge variant="stone" className="mb-3">Harga</Badge>
          <h2 className="font-display text-3xl font-bold text-stone-900">
            Mulai gratis, upgrade kapan saja
          </h2>
          <p className="text-stone-500 text-sm mt-2">
            Tidak ada biaya tersembunyi. Batalkan kapan saja.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-5 items-start">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 0.07}>
              <motion.div
                animate={plan.highlight ? { scale: 1.02 } : { scale: 1 }}
                className={cn(
                  "rounded-2xl p-6 flex flex-col",
                  plan.highlight
                    ? "border-2 border-teal-400 bg-teal-50 shadow-lift"
                    : plan.name === "Sekolah"
                    ? "border border-violet-200 bg-white"
                    : "border border-stone-200 bg-white"
                )}
              >
                {plan.popular && (
                  <Badge variant="teal" className="self-start mb-3">
                    Paling Populer
                  </Badge>
                )}
                <h3 className="font-display font-bold text-base text-stone-900">{plan.name}</h3>
                <p className="text-2xs text-stone-400 mt-0.5 mb-4">{plan.desc}</p>
                <div className="flex items-end gap-1 mb-5">
                  <span className="text-3xl font-bold font-display text-stone-900">
                    {plan.price}
                  </span>
                  <span className="text-xs text-stone-400 mb-1">/{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-stone-700">
                      <Check size={14} className="text-teal-600 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild variant={plan.variant} className="w-full">
                  <Link href="/register">{plan.cta}</Link>
                </Button>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Template Preview ──────────────────────────────────────
const TEMPLATES = [
  { mapel: "Matematika", judul: "Persamaan Linear Satu Variabel", kelas: "Kelas 7 SMP", fase: "Fase D", color: "info" as const },
  { mapel: "IPA", judul: "Sistem Tata Surya dan Planet", kelas: "Kelas 6 SD", fase: "Fase C", color: "teal" as const },
  { mapel: "Bahasa Indonesia", judul: "Menulis Teks Prosedur", kelas: "Kelas 8 SMP", fase: "Fase D", color: "warning" as const },
  { mapel: "PPKn", judul: "Nilai-Nilai Pancasila dalam Kehidupan", kelas: "Kelas 10 SMA", fase: "Fase E", color: "violet" as const },
];

function TemplatePreview() {
  return (
    <section id="templates" className="py-20 bg-stone-50">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="flex items-end justify-between mb-8">
          <div>
            <Badge variant="stone" className="mb-3">Template</Badge>
            <h2 className="font-display text-3xl font-bold text-stone-900">
              Template siap pakai
            </h2>
            <p className="text-stone-500 text-sm mt-1">
              Pilih template sebagai titik mulai, lalu AI selesaikan sisanya.
            </p>
          </div>
          <Button asChild variant="ghost-stone" size="sm">
            <Link href="/register">Lihat semua →</Link>
          </Button>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEMPLATES.map((t, i) => (
            <ScrollReveal key={t.judul} delay={i * 0.06}>
              <SpringHoverCard className="bg-white border border-stone-200 rounded-xl p-4 cursor-pointer block">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant={t.color}>{t.mapel}</Badge>
                  <span className="text-2xs text-stone-400">{t.fase}</span>
                </div>
                <h4 className="text-sm font-semibold text-stone-900 mb-1 leading-snug">
                  {t.judul}
                </h4>
                <p className="text-2xs text-stone-400">{t.kelas}</p>
                <div className="mt-3 pt-3 border-t border-stone-100">
                  <span className="text-xs text-teal-600 font-medium">
                    Gunakan template →
                  </span>
                </div>
              </SpringHoverCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA Banner ────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="py-20 bg-teal-600">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <ScrollReveal>
          <h2 className="font-display text-3xl font-bold text-white mb-3">
            Mulai buat modul ajar pertamamu — gratis
          </h2>
          <p className="text-teal-100 text-sm mb-8 max-w-md mx-auto">
            Bergabung dengan ribuan guru yang sudah menghemat puluhan jam setiap bulannya.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-md text-base font-medium bg-white text-teal-700 hover:bg-teal-50 transition-colors shadow-card"
          >
            <Sparkles size={15} />
            Coba Gratis Sekarang
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-14">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-teal-600 rounded flex items-center justify-center">
                <Sparkles size={13} className="text-white" />
              </div>
              <span className="font-display font-semibold text-base text-white">AjarAI</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Platform pembuatan Modul Ajar Kurikulum Merdeka berbasis AI untuk guru Indonesia.
            </p>
            <p className="text-2xs">© 2025 AjarAI. Hak cipta dilindungi.</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-stone-300 uppercase tracking-wider mb-4">
              Produk
            </p>
            <ul className="space-y-2">
              {["Fitur", "Template", "Harga", "Changelog", "Roadmap"].map((item) => (
                <li key={item}>
                  <Link href="/register" className="text-sm hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-stone-300 uppercase tracking-wider mb-4">
              Dukungan
            </p>
            <ul className="space-y-2">
              {["FAQ", "Panduan Penggunaan", "Kontak Kami", "Kebijakan Privasi", "Syarat & Ketentuan"].map((item) => (
                <li key={item}>
                  <Link href="/register" className="text-sm hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-6 flex items-center justify-between flex-wrap gap-3">
          <p className="text-2xs">Dibuat dengan ❤️ untuk guru-guru Indonesia</p>
          <div className="flex items-center gap-1">
            <GraduationCap size={13} className="text-teal-600" />
            <span className="text-2xs text-teal-500">Kurikulum Merdeka Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <TemplatePreview />
      <CTABanner />
      <Footer />
    </>
  );
}
