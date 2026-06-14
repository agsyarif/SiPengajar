"use client";
import { useState } from "react";
import { Menu, Sparkles } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { AnimatePresence, motion } from "framer-motion";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col flex-1 min-h-screen md:transition-[margin] md:duration-300 md:[margin-left:var(--sidebar-w,240px)]">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 h-12 shrink-0 flex items-center px-4 gap-3 bg-white/90 backdrop-blur-md border-b border-stone-200 md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-md text-stone-500 hover:bg-stone-100 transition-colors"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-teal-600 rounded flex items-center justify-center">
              <Sparkles size={11} className="text-white" />
            </div>
            <span className="font-display font-semibold text-base text-stone-900">
              SiPengajar
            </span>
          </div>
        </header>

        <main className="flex-1">
          {/* <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-8"> */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
