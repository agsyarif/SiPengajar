"use client";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface ProcessingScreenProps {
  progress?: number;
  message?: string;
}

export function ProcessingScreen({
  progress = 0,
  message = "AI sedang membuat modul pembelajaran...",
}: ProcessingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-2.5 w-2.5 rounded-full bg-teal-400"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 0.7, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>
      <div className="w-full max-w-xs flex flex-col gap-2">
        <Progress value={progress} />
        <p className="text-xs text-center text-stone-500">{message}</p>
      </div>
    </div>
  );
}
