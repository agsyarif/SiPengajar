import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  onSelect?: () => void;
}

export function PricingCard({
  name,
  price,
  period = "/bulan",
  description,
  features,
  cta,
  highlighted,
  onSelect,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-6 flex flex-col gap-5",
        highlighted
          ? "border-teal-400 bg-teal-50 shadow-lift"
          : "border-stone-200 bg-white shadow-card"
      )}
    >
      <div>
        <h3 className="text-base font-bold text-stone-900">{name}</h3>
        <p className="text-xs text-stone-500 mt-1">{description}</p>
      </div>
      <div className="flex items-end gap-1">
        <span className="text-3xl font-bold text-stone-900">{price}</span>
        <span className="text-sm text-stone-400 mb-1">{period}</span>
      </div>
      <ul className="flex flex-col gap-2">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-stone-700">
            <Check size={14} className="text-teal-600 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Button
        variant={highlighted ? "primary" : "outline"}
        className="mt-auto w-full"
        onClick={onSelect}
      >
        {cta}
      </Button>
    </div>
  );
}
