import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium
   transition-all duration-fast ease-spring select-none
   disabled:opacity-40 disabled:cursor-not-allowed`,
  {
    variants: {
      variant: {
        primary:      "bg-teal-600 text-white hover:bg-teal-800 active:bg-teal-900",
        outline:      "border border-teal-600 text-teal-600 hover:bg-teal-50",
        ghost:        "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
        danger:       "bg-danger-bg text-danger-text hover:bg-red-100",
        pro:          "bg-violet-600 text-white hover:bg-violet-800",
        "ghost-stone":"border border-stone-200 text-stone-600 hover:bg-stone-100",
      },
      size: {
        sm:   "h-8  px-3 text-xs rounded",
        md:   "h-9  px-4 text-sm",
        lg:   "h-11 px-6 text-base",
        icon: "h-9  w-9  p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size:    "md",
    },
  },
);
