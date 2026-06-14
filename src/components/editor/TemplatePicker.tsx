"use client";
import { cn } from "@/lib/utils";

export type TemplateId = "formal" | "modern";

interface TemplatePickerProps {
  value: TemplateId;
  modulId: string;
  onChange: (t: TemplateId) => void;
}

const TEMPLATES: { id: TemplateId; label: string; hint: string }[] = [
  { id: "formal", label: "Formal", hint: "Serif · Dinas" },
  { id: "modern", label: "Modern", hint: "Sans · Bersih" },
];

export function TemplatePicker({ value, modulId, onChange }: TemplatePickerProps) {
  const handleChange = async (next: TemplateId) => {
    onChange(next);
    try {
      await fetch(`/api/modul/${modulId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: next }),
      });
    } catch {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] text-stone-400 font-medium mr-0.5">Templat</span>
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => handleChange(t.id)}
          title={t.hint}
          className={cn(
            "h-7 px-2.5 rounded text-xs font-medium transition-colors border",
            value === t.id
              ? "bg-teal-50 text-teal-700 border-teal-200 ring-1 ring-teal-600/20"
              : "bg-transparent text-stone-500 border-stone-200 hover:bg-stone-100 hover:text-stone-800",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
