"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Plus,
  FileText,
  BookOpen,
  CreditCard,
  Settings,
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const W_EXPANDED = 240;
const W_COLLAPSED = 64;
const STORAGE_KEY = "sidebar-collapsed";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/modul", label: "Semua Modul", icon: FileText },
  { href: "/template", label: "Template Modul Ajar", icon: BookOpen },
  { href: "/template/atp", label: "ATP & TP per CP", icon: GitBranch },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/pengaturan", label: "Pengaturan", icon: Settings },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isPro = (session?.user as { plan?: string })?.plan === "PRO";

  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = (e: MediaQueryListEvent | MediaQueryList) => {
      const mobile = e.matches;
      setIsMobile(mobile);
      document.documentElement.style.setProperty("--sidebar-w", mobile ? "0px" : `${collapsed ? W_COLLAPSED : W_EXPANDED}px`);
    };
    update(mq);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [collapsed]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) === "true";
    setCollapsed(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    document.documentElement.style.setProperty("--sidebar-w", "0px");
  }, [isMobile]);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      document.documentElement.style.setProperty(
        "--sidebar-w",
        `${next ? W_COLLAPSED : W_EXPANDED}px`,
      );
      return next;
    });
  };

  const handleNavClick = () => {
    if (isMobile) onMobileClose?.();
  };

  const desktopW = !mounted ? W_EXPANDED : collapsed ? W_COLLAPSED : W_EXPANDED;

  return (
    <motion.aside
      animate={
        isMobile
          ? { x: mobileOpen ? 0 : -W_EXPANDED, width: W_EXPANDED }
          : { x: 0, width: desktopW }
      }
      initial={false}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className="fixed left-0 top-0 h-full bg-stone-50 border-r border-stone-200 flex flex-col z-40 overflow-hidden"
    >
      {/* ── Logo + Collapse toggle ── */}
      <div className="h-14 flex items-center px-3 border-b border-stone-200 shrink-0 gap-2">
        <Link
          href="/dashboard"
          onClick={handleNavClick}
          className="flex items-center gap-2 min-w-0 flex-1"
        >
          <div className="w-6 h-6 bg-teal-600 rounded flex items-center justify-center shrink-0">
            <Sparkles size={13} className="text-white" />
          </div>
          <AnimatePresence initial={false}>
            {(!collapsed || isMobile) && (
              <motion.span
                key="logo-text"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18 }}
                className="font-display font-semibold text-base text-stone-900 whitespace-nowrap overflow-hidden"
              >
                SiPengajar
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Mobile: close button */}
        {isMobile ? (
          <button
            onClick={onMobileClose}
            className="w-6 h-6 flex items-center justify-center rounded text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        ) : (
          <button
            onClick={toggle}
            title={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
            className="w-6 h-6 flex items-center justify-center rounded text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition-colors shrink-0"
          >
            {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>
        )}
      </div>

      {/* ── Buat Modul CTA ── */}
      <div className="px-3 pt-4 pb-2 shrink-0">
        <Link
          href="/modul/baru"
          onClick={handleNavClick}
          title="Buat Modul Baru"
          className={cn(
            "flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium text-teal-600 hover:bg-teal-50 transition-colors duration-fast",
            collapsed && !isMobile && "justify-center px-2",
          )}
        >
          <Plus size={16} className="shrink-0" />
          <AnimatePresence initial={false}>
            {(!collapsed || isMobile) && (
              <motion.span
                key="cta-text"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="whitespace-nowrap overflow-hidden"
              >
                Buat Modul Baru
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-hidden">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              title={collapsed && !isMobile ? item.label : undefined}
              className={cn(
                "nav-item relative",
                active && "active",
                collapsed && !isMobile && "justify-center px-2",
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-teal-50 rounded-md -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon size={15} className="shrink-0" />
              <AnimatePresence initial={false}>
                {(!collapsed || isMobile) && (
                  <motion.span
                    key={`nav-${item.href}`}
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom ── */}
      <div className="px-2 pb-3 border-t border-stone-200 pt-3 space-y-2 shrink-0">
        {/* Upgrade prompt */}
        <AnimatePresence initial={false}>
          {!isPro && (!collapsed || isMobile) && (
            <motion.div
              key="upgrade-box"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="rounded-lg bg-stone-100 p-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-stone-600">
                    Gratis · 3/5 modul
                  </span>
                </div>
                <div className="h-1 bg-stone-200 rounded-full mb-2">
                  <motion.div
                    className="h-full bg-teal-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "60%" }}
                    transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                <Link
                  href="/billing"
                  onClick={handleNavClick}
                  className="text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors"
                >
                  Upgrade ke Pro →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User row */}
        <div
          className={cn(
            "flex items-center gap-2 px-1",
            collapsed && !isMobile && "justify-center",
          )}
        >
          <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-xs font-medium text-teal-700 shrink-0">
            {session?.user?.name?.[0]?.toUpperCase() ?? "G"}
          </div>
          <AnimatePresence initial={false}>
            {(!collapsed || isMobile) && (
              <motion.div
                key="user-info"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-1 items-center gap-1 min-w-0 overflow-hidden"
              >
                <p className="text-xs font-medium text-stone-800 truncate flex-1">
                  {session?.user?.name ?? "Guru"}
                </p>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-stone-400 hover:text-stone-700 transition-colors shrink-0"
                  title="Keluar"
                >
                  <LogOut size={13} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
