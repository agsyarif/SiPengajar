"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Printer,
  FileText,
  PanelRight,
  X,
  BookOpen,
  Clock,
  Layers,
  GraduationCap,
  Target,
  Sparkles,
  RefreshCw,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TipTapEditor,
  EditorToolbar,
} from "@/components/editor/tiptap-editor";
import { EditorBubbleMenu } from "@/components/editor/editor-bubble-menu";
import {
  TemplatePicker,
  type TemplateId,
} from "@/components/editor/TemplatePicker";
import type { Editor } from "@tiptap/react";
import { getMapelColor, cn } from "@/lib/utils";

interface ModulData {
  id: string;
  judul: string;
  mapel: string;
  jenjang: string;
  kelas: string;
  fase: string;
  topik: string;
  tujuan: string;
  model: string;
  pertemuan: number;
  menit: number;
  status: string;
  content: string;
  template: string;
  schoolName: string;
}

const INFO_ROWS = (m: ModulData) => [
  { icon: BookOpen, label: "Mata Pelajaran", value: m.mapel },
  {
    icon: GraduationCap,
    label: "Jenjang",
    value: `${m.jenjang} · Kelas ${m.kelas}`,
  },
  { icon: Layers, label: "Fase", value: m.fase },
  { icon: Target, label: "Topik", value: m.topik },
  { icon: Sparkles, label: "Model", value: m.model },
  {
    icon: Clock,
    label: "Alokasi",
    value: `${m.pertemuan} pertemuan × ${m.menit} mnt`,
  },
];

export function ModulEditor({ modul }: { modul: ModulData }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [template, setTemplate] = useState<TemplateId>(
    (modul.template as TemplateId) ?? "formal",
  );
  const color = getMapelColor(modul.mapel);
  const isProcessing = modul.status === "PROCESSING";
  const hasContent = !isProcessing && !!modul.content;

  return (
    <div
      className="fixed inset-0 z-20 flex flex-col bg-[#F5F4F0] transition-[left] duration-300"
      style={{ left: "var(--sidebar-w, 0px)" }}
    >
      {/* ── Top bar ──────────────────────────────────────────── */}
      <header className="shrink-0 h-12 bg-white/90 backdrop-blur-md border-b border-stone-200/80 flex items-center px-4 gap-3">
        {/* Back */}
        <Button asChild variant="ghost-stone" size="sm" className="shrink-0 -ml-1">
          <Link href="/modul">
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Kembali</span>
          </Link>
        </Button>

        <div className="w-px h-4 bg-stone-200 shrink-0" />

        {/* Title */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Badge variant={color} className="shrink-0">{modul.mapel}</Badge>
          <span className="text-sm font-semibold text-stone-900 truncate">{modul.judul}</span>
          <span className="text-stone-300 shrink-0 hidden md:block">·</span>
          <span className="text-xs text-stone-400 shrink-0 hidden md:block">
            {modul.jenjang} Kelas {modul.kelas} · {modul.fase}
          </span>
        </div>

        {/* Actions */}
        {hasContent && (
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Template picker dropdown */}
            <TemplatePicker value={template} modulId={modul.id} onChange={setTemplate} />

            <div className="w-px h-4 bg-stone-200 shrink-0" />

            {/* Download dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className="h-8 px-2.5 flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white text-xs font-medium text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-colors focus:outline-none"
                >
                  <Download size={12} className="text-stone-400" />
                  <span className="hidden sm:inline">Unduh</span>
                  <ChevronDown size={11} className="text-stone-400" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  sideOffset={6}
                  align="end"
                  className="w-52 rounded-xl border border-stone-200 bg-white shadow-modal p-1.5 z-50 animate-pop-in"
                >
                  <p className="px-2.5 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                    Format Unduhan
                  </p>
                  <DropdownMenu.Item asChild>
                    <a
                      href={`/api/modul/${modul.id}/export?format=docx`}
                      download
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-stone-700 hover:bg-stone-50 outline-none cursor-pointer transition-colors"
                    >
                      <span className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                        <FileText size={13} className="text-blue-500" />
                      </span>
                      <div>
                        <p className="font-medium text-stone-800 text-xs">Word (.docx)</p>
                        <p className="text-[10px] text-stone-400">Edit ulang di Microsoft Word</p>
                      </div>
                    </a>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <a
                      href={`/api/modul/${modul.id}/export?format=pdf`}
                      download
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-stone-700 hover:bg-stone-50 outline-none cursor-pointer transition-colors"
                    >
                      <span className="w-7 h-7 rounded-md bg-red-50 flex items-center justify-center shrink-0">
                        <Printer size={13} className="text-red-400" />
                      </span>
                      <div>
                        <p className="font-medium text-stone-800 text-xs">PDF</p>
                        <p className="text-[10px] text-stone-400">Siap cetak & bagikan</p>
                      </div>
                    </a>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <div className="w-px h-4 bg-stone-200 shrink-0" />
          </div>
        )}

        {/* Info panel toggle */}
        <button
          onClick={() => setPanelOpen((v) => !v)}
          className={cn(
            "w-8 h-8 rounded-md flex items-center justify-center transition-colors shrink-0",
            panelOpen
              ? "bg-teal-50 text-teal-700"
              : "text-stone-400 hover:bg-stone-100 hover:text-stone-700",
          )}
          title="Informasi Modul"
        >
          <PanelRight size={15} />
        </button>
      </header>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        <motion.div
          className="flex-1 overflow-y-auto"
          animate={{ marginRight: panelOpen ? 0 : 0 }}
        >
          {/* Processing */}
          {isProcessing && (
            <div className="flex flex-col items-center justify-center min-h-full py-24 px-8 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
              >
                <Sparkles size={24} className="text-white" />
              </motion.div>
              <h2 className="font-display text-xl font-semibold text-stone-900 mb-2">
                AI sedang menyusun modul ini...
              </h2>
              <p className="text-sm text-stone-500 mb-8 max-w-xs">
                Biasanya selesai dalam 15–30 detik. Refresh untuk melihat
                hasilnya.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                <RefreshCw size={13} />
                Refresh Halaman
              </Button>
            </div>
          )}

          {/* Empty */}
          {!isProcessing && !modul.content && (
            <div className="flex flex-col items-center justify-center min-h-full py-24 px-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-stone-200 flex items-center justify-center mb-5">
                <BookOpen size={20} className="text-stone-400" />
              </div>
              <p className="text-sm font-medium text-stone-600 mb-1">
                Konten modul belum tersedia.
              </p>
              <p className="text-xs text-stone-400 mb-6">
                Buat modul baru untuk generate konten dengan AI.
              </p>
              <Button asChild size="sm">
                <Link href="/modul/baru">
                  <ChevronRight size={13} />
                  Buat Modul Baru
                </Link>
              </Button>
            </div>
          )}

          {/* Floating bubble menu on text selection */}
          {hasContent && editor && <EditorBubbleMenu editor={editor} />}

          {/* Sticky toolbar */}
          {hasContent && editor && (
            <div className="sticky top-0 z-20 bg-white border-b border-stone-100 shadow-sm flex justify-center">
              <EditorToolbar editor={editor} />
            </div>
          )}

          {/* Editor — paper card */}
          {hasContent && (
            <div className="py-8 px-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 28 }}
                className="max-w-185 mx-auto bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)] paper-container"
              >
                {/* App-UI header — editor-only, not in PDF */}
                <div className="px-4 sm:px-14 pt-6 sm:pt-10 pb-5 border-b border-stone-100 rounded-t-lg overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={color}>{modul.mapel}</Badge>
                    <span className="text-2xs text-stone-400">
                      {modul.jenjang} · Kelas {modul.kelas} · {modul.fase}
                    </span>
                  </div>
                  <h1 className="font-display text-xl font-bold text-stone-900 leading-snug">
                    {modul.judul}
                  </h1>
                  <p className="text-xs text-stone-400 mt-1.5 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {modul.pertemuan} pertemuan · {modul.menit} menit
                    </span>
                    <span>{modul.topik}</span>
                  </p>
                </div>

                {/* Template-scoped document body */}
                <div className={`doc-body ${template}`}>
                  {/* Kop: hidden in editor via CSS, shown in PDF via .export-mode */}
                  <div className={`kop-sekolah ${template}`}>
                    <div className="kop-school-name">
                      {modul.schoolName || "Nama Sekolah"}
                    </div>
                    <div className="kop-address">sipengajar.id</div>
                  </div>

                  <TipTapEditor
                    content={modul.content}
                    modulId={modul.id}
                    onEditorReady={setEditor}
                  />
                </div>
              </motion.div>

              <div className="h-20" />
            </div>
          )}
        </motion.div>

        {/* ── Right info panel ──────────────────────────────── */}
        <AnimatePresence>
          {panelOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 36 }}
              className="shrink-0 bg-white border-l border-stone-200 overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-4 h-12 border-b border-stone-100">
                <span className="text-xs font-semibold text-stone-700 uppercase tracking-wide">
                  Informasi Modul
                </span>
                <button
                  onClick={() => setPanelOpen(false)}
                  className="w-6 h-6 rounded flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  <X size={13} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {INFO_ROWS(modul).map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex gap-3 py-2.5 border-b border-stone-50 last:border-0"
                  >
                    <div className="w-6 h-6 rounded-md bg-stone-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={12} className="text-stone-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-2xs text-stone-400 mb-0.5">{label}</p>
                      <p className="text-xs font-medium text-stone-800 leading-snug">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="pt-3">
                  <p className="text-2xs text-stone-400 mb-1.5 uppercase tracking-wide">
                    Tujuan Pembelajaran
                  </p>
                  <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 rounded-md p-3">
                    {modul.tujuan}
                  </p>
                </div>
              </div>

              <div className="px-4 py-3 border-t border-stone-100">
                <Badge
                  variant={modul.status === "DONE" ? "teal" : "stone"}
                  className="w-full justify-center"
                >
                  {modul.status === "DONE" ? "✓ Selesai" : "Draft"}
                </Badge>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
