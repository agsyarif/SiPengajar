import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      `w-full h-10 px-3 rounded-md text-sm text-stone-900
       border border-stone-200 bg-white
       placeholder:text-stone-400
       transition-all duration-fast ease-smooth
       focus:outline-none focus:border-teal-600 focus:shadow-focus
       hover:border-stone-300
       disabled:opacity-50 disabled:cursor-not-allowed`,
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
