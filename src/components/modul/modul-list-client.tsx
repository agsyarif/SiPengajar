"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Pencil,
  Trash2,
  Clock,
  BookOpen,
  Layers,
  Timer,
  FileText,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
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
type ViewMode = "grid" | "table";

const STATUS_MAP = {
  DONE: { label: "Selesai", variant: "success" },
  DRAFT: { label: "Draft", variant: "warning" },
  PROCESSING: { label: "Proses…", variant: "info" },
} as const;

const BORDER_COLOR: Record<string, string> = {
  teal: "border-l-teal-400",
  violet: "border-l-violet-400",
  warning: "border-l-amber-400",
  info: "border-l-blue-400",
  stone: "border-l-stone-300",
};

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: "ALL", label: "Semua" },
  { key: "DONE", label: "Selesai" },
  { key: "DRAFT", label: "Draft" },
  { key: "PROCESSING", label: "Proses" },
];

const PAGE_SIZE: Record<ViewMode, number> = { grid: 6, table: 10 };

function Pagination({
  page,
  total,
  pageSize,
  onChange,
}: {
  page: number;
  total: number;
  pageSize: number;
  onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const range: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) range.push(i);
  } else {
    range.push(1);
    if (page > 3) range.push("…");
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) range.push(i);
    if (page < totalPages - 2) range.push("…");
    range.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1 pt-2">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="h-7 w-7 flex items-center justify-center rounded-md text-stone-500 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none transition"
      >
        <ChevronLeft size={14} />
      </button>
      {range.map((r, i) =>
        r === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="h-7 w-7 flex items-center justify-center text-xs text-stone-400"
          >
            …
          </span>
        ) : (
          <button
            key={r}
            onClick={() => onChange(r as number)}
            className={cn(
              "h-7 w-7 flex items-center justify-center rounded-md text-xs font-medium transition",
              page === r
                ? "bg-teal-600 text-white"
                : "text-stone-600 hover:bg-stone-100",
            )}
          >
            {r}
          </button>
        ),
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="h-7 w-7 flex items-center justify-center rounded-md text-stone-500 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none transition"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

function GridCard({
  modul,
  onDelete,
  isDeleting,
}: {
  modul: ModulItem;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const color = getMapelColor(modul.mapel);
  const status = STATUS_MAP[modul.status];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      <div
        className={cn(
          "group bg-white border border-stone-200 border-l-4 rounded-xl p-4",
          "hover:shadow-[0_4px_20px_rgba(15,110,86,0.09)] hover:-translate-y-0.5 transition-all duration-150 h-full flex flex-col",
          BORDER_COLOR[color],
          isDeleting && "opacity-50 pointer-events-none",
        )}
      >
        {/* Top */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant={color as any} className="shrink-0">
            {modul.mapel}
          </Badge>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        {/* Title */}
        <p className="flex-1 font-display font-medium text-sm text-stone-900 leading-snug line-clamp-2 mb-3">
          {modul.judul}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-2xs text-stone-400 mb-3">
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

        {/* Actions */}
        <div className="flex items-center gap-1 pt-2 border-t border-stone-100">
          <Button
            asChild
            variant="ghost-stone"
            size="sm"
            className="flex-1 justify-center"
          >
            <Link href={`/modul/${modul.id}/edit`}>
              <Pencil size={12} />
              Edit
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            disabled={isDeleting}
            className="text-stone-400 hover:text-danger-text hover:bg-danger-bg"
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function ModulListClient({ moduls: initial }: { moduls: ModulItem[] }) {
  const router = useRouter();
  const [moduls, setModuls] = useState(initial);
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("ALL");
  const [view, setView] = useState<ViewMode>("table");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSearch(value: string) {
    setInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQuery(value);
      setPage(1);
    }, 300);
  }

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  function handleFilter(f: StatusFilter) {
    setFilter(f);
    setPage(1);
  }

  function handleView(v: ViewMode) {
    setView(v);
    setPage(1);
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return moduls.filter((m) => {
      const matchQuery =
        !q ||
        m.judul.toLowerCase().includes(q) ||
        m.mapel.toLowerCase().includes(q);
      const matchStatus = filter === "ALL" || m.status === filter;
      return matchQuery && matchStatus;
    });
  }, [moduls, query, filter]);

  const pageSize = PAGE_SIZE[view];
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  async function handleDelete(id: string, judul: string) {
    if (
      !window.confirm(
        `Hapus modul "${judul}"? Tindakan ini tidak bisa dibatalkan.`,
      )
    )
      return;
    setDeletingId(id);
    setModuls((prev) => prev.filter((m) => m.id !== id));
    try {
      const res = await fetch(`/api/modul/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setModuls(initial);
      alert("Gagal menghapus modul. Coba lagi.");
    } finally {
      setDeletingId(null);
    }
  }

  const isEmpty = filtered.length === 0;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3">
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

        <div className="flex items-center justify-between gap-2">
          {/* Status tabs */}
          <div className="flex gap-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleFilter(tab.key)}
                className={cn(
                  "h-7 px-3 rounded-full text-xs font-medium transition-colors",
                  filter === tab.key
                    ? "bg-teal-600 text-white"
                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-800",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xs text-stone-400 hidden sm:block">
              {filtered.length === moduls.length
                ? `${moduls.length} modul`
                : `${filtered.length} dari ${moduls.length}`}
            </span>

            {/* View toggle */}
            <div className="flex rounded-lg border border-stone-200 overflow-hidden">
              <button
                onClick={() => handleView("grid")}
                className={cn(
                  "h-7 w-7 flex items-center justify-center transition",
                  view === "grid"
                    ? "bg-teal-600 text-white"
                    : "bg-white text-stone-400 hover:bg-stone-50",
                )}
                title="Grid"
              >
                <LayoutGrid size={13} />
              </button>
              <button
                onClick={() => handleView("table")}
                className={cn(
                  "h-7 w-7 flex items-center justify-center transition",
                  view === "table"
                    ? "bg-teal-600 text-white"
                    : "bg-white text-stone-400 hover:bg-stone-50",
                )}
                title="Tabel"
              >
                <List size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {isEmpty ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-16 text-stone-400"
          >
            <FileText size={32} className="mx-auto mb-3 opacity-25" />
            <p className="text-sm font-medium text-stone-500 mb-1">
              {query || filter !== "ALL"
                ? "Tidak ada modul yang cocok."
                : "Belum ada modul ajar."}
            </p>
            <p className="text-xs mb-4">
              {query || filter !== "ALL"
                ? "Coba ubah kata kunci atau filter."
                : "Buat modul pertama kamu — hanya butuh 2 menit."}
            </p>
            {!query && filter === "ALL" && (
              <Link
                href="/modul/baru"
                className={buttonVariants({ size: "sm" })}
              >
                Buat Sekarang
              </Link>
            )}
          </motion.div>
        ) : view === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {paginated.map((modul) => (
                  <GridCard
                    key={modul.id}
                    modul={modul}
                    isDeleting={deletingId === modul.id}
                    onDelete={() => handleDelete(modul.id, modul.judul)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="rounded-xl border border-stone-200 overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stone-100 bg-stone-50">
                      <th className="text-left px-4 py-2.5 text-2xs font-semibold text-stone-500 uppercase tracking-wide">
                        Judul
                      </th>
                      <th className="text-left px-4 py-2.5 text-2xs font-semibold text-stone-500 uppercase tracking-wide whitespace-nowrap hidden sm:table-cell">
                        Mapel
                      </th>
                      <th className="text-left px-4 py-2.5 text-2xs font-semibold text-stone-500 uppercase tracking-wide whitespace-nowrap hidden md:table-cell">
                        Kelas
                      </th>
                      <th className="text-left px-4 py-2.5 text-2xs font-semibold text-stone-500 uppercase tracking-wide whitespace-nowrap hidden lg:table-cell">
                        Durasi
                      </th>
                      <th className="text-left px-4 py-2.5 text-2xs font-semibold text-stone-500 uppercase tracking-wide">
                        Status
                      </th>
                      <th className="text-left px-4 py-2.5 text-2xs font-semibold text-stone-500 uppercase tracking-wide whitespace-nowrap hidden lg:table-cell">
                        Diperbarui
                      </th>
                      <th className="px-4 py-2.5" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    <AnimatePresence mode="popLayout">
                      {paginated.map((modul) => {
                        const color = getMapelColor(modul.mapel);
                        const status = STATUS_MAP[modul.status];
                        const isDeleting = deletingId === modul.id;
                        return (
                          <motion.tr
                            key={modul.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.15 }}
                            className={cn(
                              "group hover:bg-stone-50/60 transition-colors",
                              isDeleting && "opacity-50 pointer-events-none",
                            )}
                          >
                            <td className="px-4 py-3 max-w-[240px]">
                              <p className="font-medium text-stone-900 text-sm truncate">
                                {modul.judul}
                              </p>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <Badge variant={color as any}>
                                {modul.mapel}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-xs text-stone-500 whitespace-nowrap hidden md:table-cell">
                              {modul.jenjang} {modul.kelas}{" "}
                              <span className="text-stone-400">·</span>{" "}
                              {modul.fase}
                            </td>
                            <td className="px-4 py-3 text-xs text-stone-500 whitespace-nowrap hidden lg:table-cell">
                              {modul.pertemuan}×{modul.menit} mnt
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={status.variant}>
                                {status.label}
                              </Badge>
                            </td>
                            <td
                              className="px-4 py-3 text-xs text-stone-400 whitespace-nowrap hidden lg:table-cell"
                              suppressHydrationWarning
                            >
                              {formatRelative(modul.updatedAt)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 justify-end">
                                <Button asChild variant="ghost-stone" size="sm">
                                  <Link href={`/modul/${modul.id}/edit`}>
                                    <Pencil size={12} />
                                    Edit
                                  </Link>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDelete(modul.id, modul.judul)
                                  }
                                  disabled={isDeleting}
                                  className="text-stone-400 hover:text-danger-text hover:bg-danger-bg"
                                >
                                  <Trash2 size={12} />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {!isEmpty && (
        <div className="flex items-center justify-between">
          <span className="text-2xs text-stone-400">
            {filtered.length > pageSize
              ? `Hal. ${page} dari ${totalPages} · ${filtered.length} modul`
              : `${filtered.length} modul`}
          </span>
          <Pagination
            page={page}
            total={filtered.length}
            pageSize={pageSize}
            onChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
