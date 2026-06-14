"use client";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const TESTIMONIAL = {
  quote:
    "SiPengajar menghemat waktu saya 5–6 jam setiap minggu. Sekarang bisa fokus ke murid, bukan ke dokumen.",
  name: "Ibu Sari Wulandari, S.Pd.",
  role: "Guru Matematika · SMP N 3 Yogyakarta",
  initial: "S",
};

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — 45% */}
      <div className="hidden lg:flex w-[45%] bg-stone-100 flex-col p-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-auto">
          <div className="w-6 h-6 bg-teal-600 rounded flex items-center justify-center">
            <Sparkles size={13} className="text-[#fff]" />
          </div>
          <span className="font-display font-semibold text-base text-stone-900">
            SiPengajar
          </span>
        </Link>

        {/* Testimonial — centered vertically */}
        <div className="flex-1 flex items-center">
          <div className="max-w-xs">
            {/* Decorative quote */}
            <span
              className="block font-display text-7xl leading-none text-stone-200 dark:text-stone-300 select-none mb-2"
              aria-hidden
            >
              ❝
            </span>
            <p className="text-base font-medium text-stone-700 leading-relaxed mb-5">
              {TESTIMONIAL.quote}
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-700 flex-shrink-0">
                {TESTIMONIAL.initial}
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-800">
                  {TESTIMONIAL.name}
                </p>
                <p className="text-xs text-stone-500">{TESTIMONIAL.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="text-2xs text-stone-400 mt-auto">
          Kurikulum Merdeka Ready · 2.400+ guru aktif
        </p>
      </div>

      {/* Right panel — 55% */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-[340px]">{children}</div>
      </div>
    </div>
  );
}
