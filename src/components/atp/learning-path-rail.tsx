"use client";
import { useState, useMemo } from "react";
import { ChapterBlock } from "./chapter-block";
import { SemesterDivider } from "./semester-divider";
import { ObjectiveDetailPanel } from "./objective-detail-panel";
import { LearningOutcomeHeader } from "./learning-outcome-header";
import { SOLO_CONFIG } from "@/types";
import type {
  LearningOutcomeWithChapters,
  ObjectiveDetail,
  ChapterWithObjectives,
} from "@/types";
import { cn } from "@/lib/utils";

interface LearningPathRailProps {
  cp: LearningOutcomeWithChapters;
}

type Grade = "XI" | "XII";

export function LearningPathRail({ cp }: LearningPathRailProps) {
  const [activeGrade, setActiveGrade] = useState<Grade>("XI");
  const [activeObjective, setActiveObjective] = useState<ObjectiveDetail | null>(null);

  const filteredChapters = useMemo(
    () => cp.chapters.filter((c) => c.grade === activeGrade),
    [cp.chapters, activeGrade],
  );

  const totalJP = cp.chapters
    .flatMap((c) => c.objectives)
    .reduce((s, t) => s + t.allocationHours, 0);
  const totalTP = cp.chapters.flatMap((c) => c.objectives).length;

  function handleObjectiveClick(tp: ObjectiveDetail) {
    setActiveObjective((prev) => (prev?.code === tp.code ? null : tp));
  }

  function hasSemBreakAfter(
    unit: ChapterWithObjectives,
    chapters: ChapterWithObjectives[],
  ) {
    const idx = chapters.indexOf(unit);
    if (idx < 0 || idx === chapters.length - 1) return false;
    return unit.semester !== chapters[idx + 1].semester;
  }

  return (
    <div>
      <LearningOutcomeHeader cp={cp} totalJP={totalJP} totalTP={totalTP} />

      {/* Kelas toggle */}
      <div
        className="flex gap-1 bg-stone-100 border border-stone-200
                      rounded-lg p-1 w-fit mb-4"
      >
        {(["XI", "XII"] as Grade[]).map((g) => (
          <button
            key={g}
            onClick={() => {
              setActiveGrade(g);
              setActiveObjective(null);
            }}
            className={cn(
              "px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-150",
              activeGrade === g
                ? "bg-white text-teal-600 border border-stone-200 shadow-sm"
                : "text-stone-500 hover:text-stone-700",
            )}
          >
            Kelas {g}
          </button>
        ))}
      </div>

      {/* SOLO legend */}
      <div className="flex gap-4 flex-wrap mb-4 items-center">
        <span className="text-xs font-medium text-stone-400">Level SOLO:</span>
        {(["MULTISTRUCTURAL", "RELATIONAL", "EXTENDED_ABSTRACT"] as const).map(
          (s) => {
            const cfg = SOLO_CONFIG[s];
            return (
              <div key={s} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: cfg.dotColor }}
                />
                <span className="text-xs text-stone-500">
                  {cfg.label}
                  <span className="text-stone-400 ml-1">({cfg.sublabel})</span>
                </span>
              </div>
            );
          },
        )}
      </div>

      {/* Horizontal rail — scrollable */}
      <div className="overflow-x-auto pb-2 -mx-1 px-1">
        <div className="flex items-start gap-0 min-w-max">
          {filteredChapters.map((unit, idx) => (
            <div key={unit.id} className="flex items-start">
              <ChapterBlock
                unit={unit}
                activeObjectiveCode={activeObjective?.code ?? null}
                onTPClick={handleObjectiveClick}
              />
              {idx < filteredChapters.length - 1 &&
                (hasSemBreakAfter(unit, filteredChapters) ? (
                  <SemesterDivider
                    from={unit.semester}
                    to={filteredChapters[idx + 1].semester}
                  />
                ) : (
                  <div className="w-6 h-0.5 bg-stone-200 mt-[34px] flex-shrink-0" />
                ))}
            </div>
          ))}
        </div>
      </div>

      {!activeObjective && (
        <div
          className="mt-3 text-center py-4 text-stone-400 bg-stone-50
                        border border-dashed border-stone-200 rounded-xl"
        >
          <p className="text-xs">
            Klik salah satu node TP untuk melihat detail dan membuat Modul Ajar.
          </p>
        </div>
      )}

      <ObjectiveDetailPanel
        tp={activeObjective}
        subject={cp.subject}
        level={cp.level}
        onClose={() => setActiveObjective(null)}
      />
    </div>
  );
}
