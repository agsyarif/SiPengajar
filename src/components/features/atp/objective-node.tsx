"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SOLO_CONFIG } from "@/types";
import type { ObjectiveDetail } from "@/types";

interface ObjectiveNodeProps {
  tp: ObjectiveDetail;
  isActive: boolean;
  onClick: () => void;
}

export function ObjectiveNode({ tp, isActive, onClick }: ObjectiveNodeProps) {
  const cfg = SOLO_CONFIG[tp.soloLevel];
  const isCapstone = tp.code === "XII.6.3";

  return (
    <div
      className="flex flex-col items-center gap-1.5 cursor-pointer group"
      onClick={onClick}
    >
      <motion.div
        className={cn(
          "w-11 h-11 rounded-full border-2 flex items-center justify-center",
          "text-xs font-semibold select-none transition-shadow duration-150",
          cfg.bgClass,
          cfg.borderClass,
          cfg.textClass,
          isActive && "ring-4 ring-offset-1",
          isActive && tp.soloLevel === "MULTISTRUCTURAL" && "ring-blue-200",
          isActive && tp.soloLevel === "RELATIONAL" && "ring-teal-200",
          isActive && tp.soloLevel === "EXTENDED_ABSTRACT" && "ring-violet-200",
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.97 }}
        animate={{ scale: isActive ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
        title={tp.shortTitle}
      >
        {isCapstone ? "EA★" : cfg.short}
      </motion.div>

      <span
        className="text-[10px] text-stone-400 group-hover:text-stone-600
                       transition-colors whitespace-nowrap font-mono"
      >
        {tp.code}
      </span>
      <span className="text-[10px] text-stone-300 whitespace-nowrap">
        {tp.allocationHours} JP
      </span>
    </div>
  );
}
