"use client";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SpringHoverCard } from "@/components/motion/spring-hover";
import {
  Sparkles,
  FileText,
  Download,
  CheckCircle2,
  Star,
  BookOpen,
  Zap,
  Layers,
  GraduationCap,
  ChevronRight,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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
const TYPEWRITER_TEXT =
  "Peserta didik dapat memahami konsep persamaan linear satu variabel dan menyelesaikan permasalahan kontekstual dalam kehidupan nyata.";

function HeroMockupCard() {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startDelay = setTimeout(() => setStarted(true), 1200);
    return () => clearTimeout(startDelay);
  }, []);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= TYPEWRITER_TEXT.length) return;
    const t = setTimeout(
      () => setDisplayed(TYPEWRITER_TEXT.slice(0, displayed.length + 1)),
      28,
    );
    return () => clearTimeout(t);
  }, [started, displayed]);

  const chips = [
    {
      emoji: "⚡",
      label: "Dibuat dalam 8 detik",
      bg: "#eef8f3",
      delay: 0.9,
      pos: "-top-5 -left-12",
    },
    {
      emoji: "📄",
      label: "Siap cetak & upload",
      bg: "#fff7e6",
      delay: 1.1,
      pos: "bottom-10 -right-14",
    },
    {
      emoji: "✅",
      label: "Sesuai Kurikulum Merdeka",
      bg: "#f0f4ff",
      delay: 1.3,
      pos: "-bottom-5 left-8",
    },
  ];

  return (
    <div className="relative">
      {/* Decorative blobs */}
      <motion.div
        aria-hidden
        className="absolute rounded-full pointer-events-none opacity-[0.28] dark:opacity-[0.45]"
        style={{
          width: 260,
          height: 260,
          background: "#3aa872",
          filter: "blur(40px)",
          top: -60,
          right: -60,
        }}
        animate={{ scale: [1, 1.1, 1], x: [0, 10, 0], y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute rounded-full pointer-events-none opacity-[0.28] dark:opacity-[0.40]"
        style={{
          width: 180,
          height: 180,
          background: "#a8d8c2",
          filter: "blur(40px)",
          bottom: -40,
          left: -40,
        }}
        animate={{ scale: [1, 1.08, 1], x: [0, -8, 0], y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
      />

      {/* Floating chips */}
      {chips.map((chip) => (
        <motion.div
          key={chip.label}
          className={`absolute z-10 flex items-center gap-2 bg-white dark:bg-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-[#144830] dark:text-stone-800 border border-[rgba(26,92,58,0.06)] dark:border-stone-300 shadow-[0_8px_24px_rgba(13,51,38,0.12)] whitespace-nowrap ${chip.pos}`}
          initial={{ opacity: 0, scale: 0.8, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            delay: chip.delay,
            type: "spring",
            stiffness: 300,
            damping: 22,
          }}
        >
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
            style={{ background: chip.bg }}
          >
            {chip.emoji}
          </span>
          {chip.label}
        </motion.div>
      ))}

      {/* Main floating card */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="relative z-[2] bg-white rounded-2xl border border-[rgba(26,92,58,0.07)] p-7 w-[380px] shadow-[0_32px_80px_rgba(13,51,38,0.14),0_8px_24px_rgba(13,51,38,0.08)] dark:shadow-[0_0_60px_rgba(29,158,117,0.18),0_32px_80px_rgba(0,0,0,0.45)] paper-light"
      >
        {/* Card header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
              Modul Ajar · Kelas 7 SMP
            </p>
            <p className="font-serif text-[17px] text-stone-900 leading-snug">
              Persamaan Linear Satu Variabel
            </p>
          </div>
          <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full whitespace-nowrap">
            Done ✓
          </span>
        </div>

        <div className="h-px bg-[rgba(26,92,58,0.07)] mb-4" />

        {/* Rows */}
        {[
          { label: "Mata Pelajaran", value: "Matematika" },
          { label: "Fase / Kelas", value: "Fase D · Kelas 7" },
          { label: "Alokasi Waktu", value: "2 × 40 menit" },
          { label: "Model Pembelajaran", value: "Discovery Learning" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between py-2 border-b border-[rgba(26,92,58,0.05)] last:border-0"
          >
            <span className="text-[13px] text-stone-400">{label}</span>
            <span className="text-[13px] font-medium text-stone-800">
              {value}
            </span>
          </div>
        ))}

        {/* Goal section */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-teal-600 mt-5 mb-2.5">
          Tujuan Pembelajaran
        </p>
        <p className="text-[13.5px] text-stone-600 leading-relaxed mb-5 min-h-[60px]">
          {displayed}
          <motion.span
            className="inline-block w-0.5 h-3.5 bg-teal-600 align-middle ml-0.5"
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: [0, 0, 1, 1] }}
          />
        </p>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-[5px] bg-teal-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 1.4,
                delay: 1.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          </div>
          <span className="text-xs font-semibold text-teal-700">100%</span>
        </div>
      </motion.div>
    </div>
  );
}

// ── Navbar ───────────────────────────────────────────────
function Navbar() {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  return (
    <header className="sticky top-0 z-50 bg-stone-50/85 backdrop-blur-md border-b border-[rgba(26,92,58,0.08)]">
      <div className="px-16 h-[68px] flex items-center justify-between max-w-[1280px] mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] bg-teal-600 rounded-[10px] flex items-center justify-center">
            <Sparkles size={16} className="text-[#fff]" />
          </div>
          <span className="font-sans font-semibold text-[17px] text-stone-800 tracking-tight">
            SiPengajar
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {[
            { label: "Cara Kerja", href: "#how-it-works" },
            { label: "Fitur", href: "#features" },
            { label: "Harga", href: "#pricing" },
            { label: "Template", href: "#templates" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-[14px] font-normal text-stone-600 hover:text-teal-700 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle className="text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800" />
          <div className="w-px h-4 bg-stone-200 dark:bg-stone-700" />
          {isLoggedIn ? (
            <Button
              asChild
              size="sm"
              className="text-[14px] font-medium rounded-[10px]"
            >
              <Link href="/dashboard">
                Dashboard
                <ChevronRight size={13} />
              </Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-[14px] font-normal text-stone-600"
              >
                <Link href="/login">Masuk</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="text-[14px] font-medium rounded-[10px]"
              >
                <Link href="/register">
                  Coba Gratis
                  <ChevronRight size={13} />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// ── Hero ─────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden bg-stone-50 min-h-[calc(100vh-68px)] flex flex-col justify-center">
      {/* Dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #1a5c3a18 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Bottom fade */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stone-50 to-transparent pointer-events-none"
      />

      {/* Content */}
      <div className="relative max-w-[1280px] mx-auto px-16 pt-[52px] pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left — copy */}
          <div className="flex flex-col gap-0">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 28,
                delay: 0.2,
              }}
              className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 text-teal-700 text-[12.5px] font-medium rounded-full px-[14px] py-[6px] w-fit mb-7"
            >
              <motion.span
                className="w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0"
                animate={{ opacity: [1, 0.4, 1], scale: [1, 0.65, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
              />
              Untuk Guru SD · SMP · SMA Indonesia
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 26,
                delay: 0.35,
              }}
              className="font-display font-normal text-[clamp(44px,5vw,62px)] text-stone-900 leading-[1.08] tracking-[-1.5px] mb-6"
            >
              Buat Modul Ajar
              <br />
              dalam{" "}
              <span className="italic text-teal-700">
                <WavyUnderline>hitungan detik</WavyUnderline>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 26,
                delay: 0.5,
              }}
              className="text-[16.5px] leading-[1.7] font-light text-stone-500 max-w-[440px] mb-10"
            >
              {/* AjarAI membantu guru membuat Modul Ajar Kurikulum Merdeka yang
              lengkap, terstruktur, dan siap pakai — hanya dalam 2 menit */}
              {/* AjarAI buat Modul Ajar Kurikulum Merdeka untuk Anda — lengkap,
              terstruktur, dan siap pakai dalam 2 menit. */}
              {/* Hemat puluhan jam setiap minggu. AjarAI membantu guru membuat
              Modul Ajar Kurikulum Merdeka yang lengkap, terstruktur, dan
              langsung siap pakai — hanya dalam 2 menit. */}
              Hemat puluhan jam setiap minggu. Lengkap, terstruktur, dan
              langsung siap pakai hanya dalam 2 menit.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="flex items-center gap-5 flex-wrap mb-[52px]"
            >
              <Button
                asChild
                size="lg"
                className="relative overflow-hidden rounded-xl text-[15px] font-medium h-12 px-7"
              >
                <Link href="/register">
                  <motion.div
                    aria-hidden
                    className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                    animate={{ x: ["-150%", "250%"] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "linear",
                      repeatDelay: 2,
                    }}
                  />
                  <Sparkles size={16} className="relative z-10" />
                  <span className="relative z-10">Coba Gratis Sekarang</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost-stone"
                size="lg"
                className="text-[15px] text-stone-600 gap-2"
              >
                <Link href="#how-it-works">
                  Lihat cara kerja
                  <ChevronRight size={16} />
                </Link>
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-4"
            >
              <div className="flex -space-x-2.5">
                {(["#2d7d9a", "#8b5e3c", "#6b4c9a", "#c0514a"] as const).map(
                  (bg, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full border-[2.5px] border-stone-50 flex items-center justify-center text-xs font-semibold text-white"
                      style={{ backgroundColor: bg }}
                    >
                      {["A", "B", "C", "D"][i]}
                    </div>
                  ),
                )}
              </div>
              <div className="ml-1">
                <div className="flex items-center gap-0.5 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className="text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-[13px] text-stone-500">
                  Dipercaya{" "}
                  <span className="font-semibold text-stone-800">20+ guru</span>{" "}
                  di seluruh Indonesia
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right — mockup card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 28,
              delay: 0.45,
            }}
            className="flex justify-center items-center py-16 px-16"
          >
            <HeroMockupCard />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <span className="text-[10px] text-stone-400 tracking-[.12em] uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ scaleY: [1, 0.5, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
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
      desc: "Masukkan mata pelajaran, jenjang, kelas, topik, dan tujuan pembelajaran.",
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
          <Badge variant="stone" className="mb-3">
            Cara Kerja
          </Badge>
          <h2 className="font-display text-3xl font-bold text-stone-900">
            Tiga langkah sederhana
          </h2>
          <p className="text-stone-500 text-sm mt-2 max-w-md mx-auto">
            Dari form kosong ke modul ajar siap pakai dalam waktu kurang dari
            semenit.
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
                <p className="text-sm text-stone-500 leading-relaxed">
                  {step.desc}
                </p>
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
    {
      icon: CheckCircle2,
      title: "Format Kemendikbud",
      desc: "Otomatis sesuai komponen wajib: identitas, CP, TP, ATP, kegiatan pembelajaran, dan asesmen.",
      accent: true,
    },
    {
      icon: BookOpen,
      title: "Kurikulum Merdeka",
      desc: "Memahami fase, elemen, dan dimensi Profil Pelajar Pancasila secara mendalam.",
      accent: true,
    },
    {
      icon: FileText,
      title: "Editor Built-in",
      desc: "Edit langsung di browser — bold, bullet, heading, tanpa perlu Word atau Google Docs.",
      accent: false,
    },
    {
      icon: Download,
      title: "Export PDF & Word",
      desc: "Download satu klik. File .pdf dan .docx siap cetak dan dikirim ke kepala sekolah.",
      accent: false,
    },
    {
      icon: Zap,
      title: "Generate dalam 30 Detik",
      desc: "Dari form ke modul lengkap dalam hitungan detik. Bukan jam, bukan hari.",
      accent: true,
    },
    {
      icon: Layers,
      title: "Semua Mata Pelajaran",
      desc: "IPA, IPS, Matematika, Bahasa Indonesia, Bahasa Inggris — semua mapel SD hingga SMA.",
      accent: false,
    },
  ];

  return (
    <section id="features" className="py-20 bg-stone-50">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <Badge variant="stone" className="mb-3">
            Fitur
          </Badge>
          <h2 className="font-display text-3xl font-bold text-stone-900">
            Semua yang kamu butuhkan
          </h2>
          <p className="text-stone-500 text-sm mt-2 max-w-md mx-auto">
            Dirancang khusus untuk guru Indonesia, dari pengisian form hingga
            dokumen final.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feat, i) => (
            <ScrollReveal key={feat.title} delay={i * 0.05}>
              <SpringHoverCard className="bg-white border border-stone-200 rounded-xl p-5 h-full block">
                <div
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center mb-3",
                    feat.accent ? "bg-teal-50" : "bg-stone-100",
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
                <p className="text-xs text-stone-500 leading-relaxed">
                  {feat.desc}
                </p>
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
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  const [period, setPeriod] = useState<"bulanan" | "tahunan">("bulanan");

  function ctaHref(planName: string) {
    if (!isLoggedIn) return "/register";
    if (planName === "Gratis") return "/dashboard";
    if (planName === "Pro") return "/harga";
    return "#kontak";
  }

  const plans = [
    {
      name: "Gratis",
      priceMonthly: 0,
      priceYearly: 0,
      periodLabel: "selamanya",
      desc: "Untuk mencoba SiPengajar",
      features: [
        "5 modul per bulan",
        "Format standar Kemendikbud",
        "Export PDF",
        "Editor built-in",
      ],
      cta: "Mulai Gratis",
      variant: "outline" as const,
      highlight: false,
      popular: false,
    },
    {
      name: "Pro",
      priceMonthly: 79000,
      priceYearly: 59000,
      periodLabel: "per bulan",
      desc: "Untuk guru aktif",
      features: [
        "Modul tak terbatas",
        "Export PDF + Word (.docx)",
        "Template premium",
        "Prioritas generate",
        "Riwayat modul",
      ],
      cta: "Mulai Pro",
      variant: "primary" as const,
      highlight: true,
      popular: true,
    },
    {
      name: "Sekolah",
      priceMonthly: 499000,
      priceYearly: 399000,
      periodLabel: "per bulan",
      desc: "Untuk tim guru & sekolah",
      features: [
        "Hingga 20 guru",
        "Dashboard admin",
        "Laporan penggunaan",
        "Branding sekolah",
        "Dukungan prioritas",
      ],
      cta: "Hubungi Kami",
      variant: "pro" as const,
      highlight: false,
      popular: false,
    },
  ];

  function formatPrice(monthly: number, yearly: number) {
    const price = period === "bulanan" ? monthly : yearly;
    if (price === 0) return "Gratis";
    return `Rp ${(price / 1000).toFixed(0)}rb`;
  }

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-10">
          <Badge variant="stone" className="mb-3">
            Harga
          </Badge>
          <h2 className="font-display text-3xl font-bold text-stone-900">
            Mulai gratis, upgrade kapan saja
          </h2>
          <p className="text-stone-500 text-sm mt-2 mb-6">
            Tidak ada biaya tersembunyi. Batalkan kapan saja.
          </p>

          {/* Bulanan / Tahunan toggle */}
          <div className="inline-flex items-center gap-3 bg-stone-100 rounded-full px-4 py-2">
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
                "relative w-10 h-5 rounded-full transition-colors shrink-0",
                period === "tahunan" ? "bg-teal-600" : "bg-stone-300",
              )}
            >
              <motion.div
                className="absolute top-0.5 w-4 h-4 bg-[#fff] rounded-full shadow-sm"
                animate={{
                  left: period === "tahunan" ? "calc(100% - 18px)" : "2px",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            </button>
            <button
              onClick={() => setPeriod("tahunan")}
              className={cn(
                "text-sm font-medium transition-colors flex items-center gap-1.5",
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
                    className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-2xs font-semibold px-1.5 py-0.5 rounded-full"
                  >
                    <Zap size={9} />
                    Hemat 25%
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
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
                      : "border border-stone-200 bg-white",
                )}
              >
                {plan.popular && (
                  <Badge variant="teal" className="self-start mb-3">
                    Paling Populer
                  </Badge>
                )}
                <h3 className="font-display font-bold text-base text-stone-900">
                  {plan.name}
                </h3>
                <p className="text-2xs text-stone-400 mt-0.5 mb-4">
                  {plan.desc}
                </p>
                <div className="h-10 flex items-end gap-1 mb-1">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`${plan.name}-${period}`}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="text-3xl font-bold font-display text-stone-900"
                    >
                      {formatPrice(plan.priceMonthly, plan.priceYearly)}
                    </motion.span>
                  </AnimatePresence>
                  {plan.priceMonthly > 0 && (
                    <span className="text-xs text-stone-400 mb-1">
                      /{plan.periodLabel}
                    </span>
                  )}
                </div>
                {period === "tahunan" && plan.priceMonthly > 0 && (
                  <p className="text-2xs text-teal-600 mb-4">
                    Hemat Rp{" "}
                    {(
                      ((plan.priceMonthly - plan.priceYearly) * 12) /
                      1000
                    ).toFixed(0)}
                    rb/tahun
                  </p>
                )}
                {!(period === "tahunan" && plan.priceMonthly > 0) && (
                  <div className="mb-4" />
                )}
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-stone-700"
                    >
                      <Check
                        size={14}
                        className="text-teal-600 shrink-0 mt-0.5"
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild variant={plan.variant} className="w-full">
                  <Link href={ctaHref(plan.name)}>{plan.cta}</Link>
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
  {
    mapel: "Matematika",
    judul: "Persamaan Linear Satu Variabel",
    kelas: "Kelas 7 SMP",
    fase: "Fase D",
    color: "info" as const,
  },
  {
    mapel: "IPA",
    judul: "Sistem Tata Surya dan Planet",
    kelas: "Kelas 6 SD",
    fase: "Fase C",
    color: "teal" as const,
  },
  {
    mapel: "Bahasa Indonesia",
    judul: "Menulis Teks Prosedur",
    kelas: "Kelas 8 SMP",
    fase: "Fase D",
    color: "warning" as const,
  },
  {
    mapel: "PPKn",
    judul: "Nilai-Nilai Pancasila dalam Kehidupan",
    kelas: "Kelas 10 SMA",
    fase: "Fase E",
    color: "violet" as const,
  },
];

function TemplatePreview() {
  return (
    <section id="templates" className="py-20 bg-stone-50">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="flex items-end justify-between mb-8">
          <div>
            <Badge variant="stone" className="mb-3">
              Template
            </Badge>
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
          <h2 className="font-display text-3xl font-bold text-[#fff] mb-3">
            Mulai buat modul ajar pertamamu — gratis
          </h2>
          <p className="text-[rgba(255,255,255,0.75)] text-sm mb-8 max-w-md mx-auto">
            Bergabung dengan ribuan guru yang sudah menghemat puluhan jam setiap
            bulannya.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-md text-base font-medium bg-[#fff] text-teal-800 hover:bg-[#f0faf7] transition-colors shadow-card"
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
    <footer className="bg-stone-900 dark:bg-stone-50 text-stone-400 dark:text-stone-600 py-14">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-teal-600 rounded flex items-center justify-center">
                <Sparkles size={13} className="text-[#fff]" />
              </div>
              <span className="font-display font-semibold text-base text-[#fff]">
                SiPengajar
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Platform pembuatan Modul Ajar Kurikulum Merdeka berbasis AI untuk
              guru Indonesia.
            </p>
            <p className="text-2xs">© 2025 SiPengajar. Hak cipta dilindungi.</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-stone-300 dark:text-stone-700 uppercase tracking-wider mb-4">
              Produk
            </p>
            <ul className="space-y-2">
              {["Fitur", "Template", "Harga", "Changelog", "Roadmap"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="/register"
                      className="text-sm hover:text-[#fff] transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-stone-300 dark:text-stone-700 uppercase tracking-wider mb-4">
              Dukungan
            </p>
            <ul className="space-y-2">
              {[
                "FAQ",
                "Panduan Penggunaan",
                "Kontak Kami",
                "Kebijakan Privasi",
                "Syarat & Ketentuan",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="/register"
                    className="text-sm hover:text-[#fff] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 dark:border-stone-200 pt-6 flex items-center justify-between flex-wrap gap-3">
          <p className="text-2xs">Dibuat dengan ❤️ untuk guru-guru Indonesia</p>
          <div className="flex items-center gap-1">
            <GraduationCap size={13} className="text-teal-600" />
            <span className="text-2xs text-teal-400">
              Kurikulum Merdeka Ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <SessionProvider>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <TemplatePreview />
      <CTABanner />
      <Footer />
    </SessionProvider>
  );
}
