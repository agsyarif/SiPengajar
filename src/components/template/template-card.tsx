import { SpringHoverCard } from "@/components/motion/spring-hover";
import type { Template } from "@/types";

export function TemplateCard({
  template,
  onSelect,
}: {
  template: Template;
  onSelect: (t: Template) => void;
}) {
  return (
    <SpringHoverCard>
      <button
        onClick={() => onSelect(template)}
        className="w-full text-left rounded-xl border border-stone-200 bg-white p-4 shadow-card"
      >
        <h3 className="text-sm font-semibold text-stone-900 mb-1">{template.name}</h3>
        <p className="text-xs text-stone-500 line-clamp-2">{template.description}</p>
        <span className="mt-3 inline-block text-2xs text-teal-600 font-medium">{template.category}</span>
      </button>
    </SpringHoverCard>
  );
}
