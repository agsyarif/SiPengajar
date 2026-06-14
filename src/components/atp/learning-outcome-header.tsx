import { Badge } from "@/components/ui/badge";
import { BookOpen, List, Target, Clock } from "lucide-react";
import type { LearningOutcomeWithChapters } from "@/types";

interface LearningOutcomeHeaderProps {
  cp: LearningOutcomeWithChapters;
  totalJP: number;
  totalTP: number;
}

export function LearningOutcomeHeader({
  cp,
  totalJP,
  totalTP,
}: LearningOutcomeHeaderProps) {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 mb-4">
      <div className="flex items-start gap-3 flex-wrap">
        <Badge
          variant="teal"
          className="text-xs px-3 py-1 rounded-full flex-shrink-0"
        >
          CP · {cp.phase}
        </Badge>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-base font-semibold text-stone-900">
            {cp.subject} — {cp.level}
          </h2>
          <div className="flex gap-2 flex-wrap mt-1.5">
            {[
              { icon: BookOpen, label: `${cp.elements.length} Elemen CP` },
              { icon: List, label: `${cp.chapters.length} Unit` },
              { icon: Target, label: `${totalTP} TP` },
              { icon: Clock, label: `${totalJP} JP total` },
            ].map((m) => (
              <span
                key={m.label}
                className="inline-flex items-center gap-1 text-xs text-stone-500
                           bg-stone-50 border border-stone-200 px-2.5 py-1 rounded-full"
              >
                <m.icon size={11} />
                {m.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 pt-3
                      border-t border-stone-100"
      >
        {cp.elements.map((el) => (
          <div key={el.name} className="bg-stone-50 rounded-lg p-3">
            <p className="text-xs font-medium text-stone-700 mb-0.5">
              {el.name}
            </p>
            <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
              {el.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
