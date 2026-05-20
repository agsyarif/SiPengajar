"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, Pencil, Trash2, Clock, BookOpen,
  Layers, Timer, FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/lib/button-variants";
import { cn, formatRelative, getMapelColor } from "@/lib/utils";

export type ModulItem = {
  id: string;
  judul: string;
  mapel: string;
  jenjang: string;
  kelas: string;
  fase: string;
  status: "DONE" | "DRAFT" | "PROCESSING";
  pertemuan: number;
  menit: number;
  updatedAt: Date;
};

type StatusFilter = "ALL" | "DONE" | "DRAFT" | "PROCESSING";

const STATUS_MAP = {
  DONE:       { label: "Selesai", variant: "success"  },
  DRAFT:      { label: "Draft",   variant: "warning"  },
  PROCESSING: { label: "Proses…", variant: "info"     },
} as const;

const BORDER_COLOR: Record<string, string> = {
  teal:    "border-l-teal-400",
  violet:  "border-l-violet-400",
  warning: "border-l-amber-400",
  info:    "border-l-blue-400",
  stone:   "border-l-stone-300",
};

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: "ALL",        label: "Semua"   },
  { key: "DONE",       label: "Selesai" },
  { key: "DRAFT",      label: "Draft"   },
  { key: "PROCESSING", label: "Proses"  },
];

export function ModulListClient({ moduls: initial }: { moduls: ModulItem[] }) {
  const router = useRouter();
  const [moduls, setModuls] = useState(initial);
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery]           = useState("");
  const debounceRef                 = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSearch(value: string) {
    setInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setQuery(value), 300);
  }

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);
  const [filter, setFilter] = useState<StatusFilter>("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return moduls.filter((m) => {
      const matchQuery =
        !q || m.judul.toLowerCase().includes(q) || m.mapel.toLowerCase().includes(q);
      const matchStatus = filter === "ALL" || m.status === filter;
      return matchQuery && matchStatus;
    });
  }, [moduls, query, filter]);

  async function handleDelete(id: string, judul: string) {
    if (!window.confirm(`Hapus modul "${judul}"? Tindakan ini tidak bisa dibatalkan.`)) return;

    setDeletingId(id);
    // Optimistic remove
    setModuls((prev) => prev.filter((m) => m.id !== id));

    try {
      const res = await fetch(`/api/modul/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      // Revert on error
      setModuls(initial);
      alert("Gagal menghapus modul. Coba lagi.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Search + filter bar */}
      <div className="flex flex-col gap-3">
        {/* Search input */}
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Cari modul atau mata pelajaran…"
            value={inputValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-9 rounded-lg border border-stone-200 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
          />
        </div>

        {/* Status tabs + count */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={cn(
                  "h-7 px-3 rounded-full text-xs font-medium transition-colors",
                  filter === tab.key
                    ? "bg-teal-600 text-white"
                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <span className="text-2xs text-stone-400">
            {filtered.length === moduls.length
              ? `${moduls.length} modul`
              : `${filtered.length} dari ${moduls.length} modul`}
          </span>
        </div>
      </div>

      {/* List */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-16 text-stone-400"
          >
            <FileText size={32} className="mx-auto mb-3 opacity-25" />
            <p className="text-sm font-medium text-stone-500 mb-1">
              {query || filter !== "ALL" ? "Tidak ada modul yang cocok." : "Belum ada modul ajar."}
            </p>
            <p className="text-xs mb-4">
              {query || filter !== "ALL"
                ? "Coba ubah kata kunci atau filter."
                : "Buat modul pertama kamu — hanya butuh 2 menit."}
            </p>
            {!query && filter === "ALL" && (
              <Link href="/modul/baru" className={buttonVariants({ size: "sm" })}>
                Buat Sekarang
              </Link>
            )}
          </motion.div>
        ) : (
          filtered.map((modul) => {
            const color    = getMapelColor(modul.mapel);
            const status   = STATUS_MAP[modul.status];
            const isDeleting = deletingId === modul.id;

            return (
              <motion.div
                key={modul.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -16, height: 0, marginBottom: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              >
                <div
                  className={cn(
                    "group bg-white border border-stone-200 border-l-4 rounded-lg px-4 py-3.5",
                    "hover:shadow-[0_4px_16px_rgba(15,110,86,0.08)] hover:-translate-y-px transition-all duration-150",
                    BORDER_COLOR[color],
                    isDeleting && "opacity-50 pointer-events-none"
                  )}
                >
                  {/* Top row: badge + title + status */}
                  <div className="flex items-start gap-3 mb-2">
                    <Badge variant={color} className="shrink-0 mt-0.5">
                      {modul.mapel}
                    </Badge>

                    <p className="flex-1 min-w-0 font-display font-normal text-[15px] text-stone-900 leading-snug truncate">
                      {modul.judul}
                    </p>

                    <Badge variant={status.variant} className="shrink-0">
                      {status.label}
                    </Badge>
                  </div>

                  {/* Bottom row: metadata + actions */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 text-2xs text-stone-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <BookOpen size={10} />
                        {modul.jenjang} Kelas {modul.kelas}
                      </span>
                      <span className="flex items-center gap-1">
                        <Layers size={10} />
                        {modul.fase}
                      </span>
                      <span className="flex items-center gap-1">
                        <Timer size={10} />
                        {modul.pertemuan}×{modul.menit} mnt
                      </span>
                      <span className="flex items-center gap-1" suppressHydrationWarning>
                        <Clock size={10} />
                        {formatRelative(modul.updatedAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button asChild variant="ghost-stone" size="sm">
                        <Link href={`/modul/${modul.id}/edit`}>
                          <Pencil size={12} />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(modul.id, modul.judul)}
                        disabled={isDeleting}
                        className="text-stone-400 hover:text-danger-text hover:bg-danger-bg"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </AnimatePresence>
    </div>
  );
}
