"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Check, LayoutTemplate } from "lucide-react";
import { cn } from "@/lib/utils";

export type TemplateId = "formal" | "modern";

interface TemplatePickerProps {
  value: TemplateId;
  modulId: string;
  onChange: (t: TemplateId) => void;
}

const TEMPLATES: {
  id: TemplateId;
  label: string;
  desc: string;
  lines: number[];
}[] = [
  {
    id: "formal",
    label: "Formal",
    desc: "Serif · Gaya dinas & pemerintahan",
    lines: [100, 75, 90, 60, 85],
  },
  {
    id: "modern",
    label: "Modern",
    desc: "Sans-serif · Bersih & minimalis",
    lines: [100, 80, 65, 90, 70],
  },
];

export function TemplatePicker({ value, modulId, onChange }: TemplatePickerProps) {
  const current = TEMPLATES.find((t) => t.id === value) ?? TEMPLATES[0];

  const handleChange = async (next: string) => {
    const nextId = next as TemplateId;
    onChange(nextId);
    try {
      await fetch(`/api/modul/${modulId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: nextId }),
      });
    } catch {
      onChange(value);
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="h-8 px-2.5 flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white text-xs font-medium text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-colors focus:outline-none"
        >
          <LayoutTemplate size={12} className="text-stone-400" />
          <span>{current.label}</span>
          <ChevronDown size={11} className="text-stone-400" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={6}
          align="end"
          className="w-60 rounded-xl border border-stone-200 bg-white shadow-modal p-1.5 z-50 animate-pop-in"
        >
          <p className="px-2.5 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-stone-400">
            Templat Dokumen
          </p>
          <DropdownMenu.RadioGroup value={value} onValueChange={handleChange}>
            {TEMPLATES.map((t) => (
              <DropdownMenu.RadioItem
                key={t.id}
                value={t.id}
                className={cn(
                  "group relative flex items-center gap-3 px-2.5 py-2.5 rounded-lg outline-none cursor-pointer transition-colors",
                  "hover:bg-stone-50 data-[state=checked]:bg-teal-50",
                )}
              >
                {/* Mini page preview */}
                <div
                  className={cn(
                    "w-10 h-12 rounded-md border bg-white flex flex-col gap-[3px] p-1.5 shrink-0 transition-colors",
                    "border-stone-200 group-data-[state=checked]:border-teal-300",
                  )}
                >
                  {/* Header bar */}
                  <div
                    className={cn(
                      "h-1.5 w-full rounded-[2px] transition-colors",
                      t.id === "formal"
                        ? "rounded-none bg-stone-400 group-data-[state=checked]:bg-teal-500"
                        : "rounded bg-stone-300 group-data-[state=checked]:bg-teal-400",
                    )}
                  />
                  {/* Content lines */}
                  {t.lines.slice(1).map((w, i) => (
                    <div
                      key={i}
                      className="h-[3px] rounded-full bg-stone-200 group-data-[state=checked]:bg-teal-200 transition-colors"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium transition-colors",
                      "text-stone-800 group-data-[state=checked]:text-teal-700",
                    )}
                  >
                    {t.label}
                  </p>
                  <p className="text-[10px] text-stone-400 leading-snug mt-0.5">
                    {t.desc}
                  </p>
                </div>

                <DropdownMenu.ItemIndicator className="shrink-0">
                  <Check size={13} className="text-teal-600" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>

          <DropdownMenu.Separator className="my-1.5 h-px bg-stone-100" />
          <p className="px-2.5 pb-1.5 text-[10px] text-stone-400">
            Templat berlaku pada saat export dokumen.
          </p>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
