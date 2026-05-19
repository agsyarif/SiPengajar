import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
}

export function Progress({ value, max = 100, className }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("h-1.5 w-full rounded-full bg-stone-200", className)}>
      <div
        className="h-full rounded-full bg-teal-400 transition-all duration-slow"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
