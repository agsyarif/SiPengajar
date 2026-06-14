"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className={cn("w-7 h-7", className)} />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
      className={cn(
        "w-7 h-7 flex items-center justify-center rounded-md transition-colors",
        "text-stone-400 hover:text-stone-700 hover:bg-stone-100",
        "dark:text-stone-500 dark:hover:text-stone-300 dark:hover:bg-stone-800",
        className,
      )}
    >
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
}
