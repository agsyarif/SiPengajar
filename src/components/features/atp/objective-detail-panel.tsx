"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Sparkles, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SOLO_CONFIG } from "@/types";
import type { ObjectiveDetail } from "@/types";

interface ObjectiveDetailPanelProps {
  tp: ObjectiveDetail | null;
  subject: string;
  level: string;
  onClose: () => void;
}

const FLOW_LABELS = ["Memahami", "Mengaplikasi", "Merefleksi"] as const;

function levelToJenjang(level: string): string {
  return level.split("/")[0];
}

function gradeToNumeric(grade: string): string {
  if (grade === "XII") return "12";
  if (grade === "XI") return "11";
  if (grade === "X") return "10";
  return grade;
}

export function ObjectiveDetailPanel({
  tp,
  subject,
  level,
  onClose,
}: ObjectiveDetailPanelProps) {
  const router = useRouter();

  function handleGenerate() {
    if (!tp) return;
    const grade = tp.code.startsWith("XII") ? "XII" : "XI";
    const params = new URLSearchParams({
      from_objective: "true",
      tp_code: tp.code,
      mapel: subject,
      jenjang: levelToJenjang(level),
      kelas: gradeToNumeric(grade),
      topik: tp.shortTitle,
      tujuan: tp.title,
      alokasi: tp.allocationHours.toString(),
    });
    router.push(`/modul/baru?${params.toString()}`);
  }

  return (
    <AnimatePresence>
      {tp && (
        <motion.div
          key={tp.code}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="bg-white border border-stone-200 rounded-xl p-4 mt-3"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex gap-2 flex-wrap mb-2">
                <Badge
                  className={`text-xs rounded-full ${SOLO_CONFIG[tp.soloLevel].textClass}
                               ${SOLO_CONFIG[tp.soloLevel].bgClass}
                               border ${SOLO_CONFIG[tp.soloLevel].borderClass}`}
                >
                  {SOLO_CONFIG[tp.soloLevel].label}
                </Badge>
                <Badge variant="stone" className="text-xs rounded-full">
                  <Clock size={10} className="mr-1" />
                  {tp.allocationHours} JP
                </Badge>
              </div>
              <p className="text-sm font-medium text-stone-900 leading-relaxed">
                <span className="font-mono text-stone-400 mr-1.5">
                  {tp.code}
                </span>
                {tp.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-700 transition-colors
                         hover:bg-stone-100 rounded-md p-1 flex-shrink-0"
            >
              <X size={15} />
            </button>
          </div>

          {/* Alur belajar */}
          <div className="mb-3">
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
              Alur belajar
            </p>
            <div className="flex items-start gap-2 flex-wrap">
              {tp.learningFlow.map((flow, idx) => (
                <div key={flow.sequence} className="flex items-center gap-2">
                  <div
                    className="bg-stone-50 border border-stone-200
                                  rounded-lg px-3 py-2 min-w-0 max-w-[200px]"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <div
                        className="w-4 h-4 rounded-full bg-teal-600
                                      flex items-center justify-center flex-shrink-0"
                      >
                        <span className="text-[10px] font-semibold text-white">
                          {flow.sequence}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-stone-700">
                        {FLOW_LABELS[idx]}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed line-clamp-3">
                      {flow.description}
                    </p>
                  </div>
                  {idx < tp.learningFlow.length - 1 && (
                    <ChevronRight
                      size={14}
                      className="text-stone-300 flex-shrink-0"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Asesmen */}
          <div className="mb-3">
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
              Asesmen
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Formatif", value: tp.formativeAssessment },
                { label: "Sumatif", value: tp.summativeAssessment },
              ].map((a) => (
                <div key={a.label} className="bg-stone-50 rounded-lg p-3">
                  <p className="text-[10px] text-stone-400 mb-1">{a.label}</p>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {a.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Profil Pelajar */}
          <div className="mb-4">
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
              Profil Pelajar Pancasila
            </p>
            <div className="flex flex-wrap gap-1.5">
              {tp.profileDimensions.map((p) => (
                <span
                  key={p}
                  className="text-xs text-stone-500 bg-stone-100
                             border border-stone-200 px-2.5 py-1 rounded-full"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Generate */}
          <Button onClick={handleGenerate} className="w-full gap-2" size="lg">
            <Sparkles size={15} />
            Buat Modul Ajar dari TP ini
          </Button>
          <p className="text-[10px] text-stone-400 text-center mt-2">
            Form akan ter-isi otomatis dari data TP ini. Kamu bisa edit sebelum
            generate.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
