"use client";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar({ title }: { title?: string }) {
  return (
    <header className="h-[var(--header-height)] flex items-center justify-between px-6 border-b border-stone-200 bg-white shrink-0">
      <h1 className="text-base font-semibold text-stone-900">{title}</h1>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell size={16} />
        </Button>
      </div>
    </header>
  );
}
