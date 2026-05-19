import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded px-2 py-0.5 text-2xs font-medium",
  {
    variants: {
      variant: {
        teal: "bg-teal-50  text-teal-800",
        violet: "bg-violet-50 text-violet-800",
        stone: "bg-stone-100 text-stone-600 border border-stone-200",
        success: "bg-success-bg text-success-text",
        warning: "bg-warning-bg text-warning-text",
        danger: "bg-danger-bg text-danger-text",
        info: "bg-info-bg text-info-text",
        dark: "bg-stone-800 text-stone-100",
      },
    },
    defaultVariants: { variant: "stone" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
