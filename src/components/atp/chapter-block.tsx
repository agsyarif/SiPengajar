import { ObjectiveNode } from "./objective-node";
import type { ChapterWithObjectives, ObjectiveDetail } from "@/types";

interface ChapterBlockProps {
  unit: ChapterWithObjectives;
  activeObjectiveCode: string | null;
  onTPClick: (tp: ObjectiveDetail) => void;
}

export function ChapterBlock({
  unit,
  activeObjectiveCode,
  onTPClick,
}: ChapterBlockProps) {
  return (
    <div
      className="bg-stone-50 border border-stone-200 rounded-xl
                    px-4 pt-2.5 pb-4 flex-shrink-0"
    >
      <p
        className="text-[10px] font-medium text-stone-400 tracking-wider
                    uppercase text-center mb-3"
      >
        Unit {unit.number} · {unit.name}
      </p>

      <div className="flex items-start gap-0">
        {unit.objectives.map((tp, idx) => (
          <div key={tp.code} className="flex items-center">
            <ObjectiveNode
              tp={tp}
              isActive={activeObjectiveCode === tp.code}
              onClick={() => onTPClick(tp)}
            />
            {idx < unit.objectives.length - 1 && (
              <div className="w-5 h-0.5 bg-stone-200 mx-0 mb-7 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
