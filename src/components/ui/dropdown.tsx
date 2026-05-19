"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export const Dropdown = DropdownMenu.Root;
export const DropdownTrigger = DropdownMenu.Trigger;

export function DropdownContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        className={cn(
          "min-w-[160px] rounded-xl border border-stone-200 bg-white shadow-modal p-1 z-50",
          "animate-pop-in",
          className
        )}
        sideOffset={4}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
}

export function DropdownItem({
  children,
  onClick,
  className,
  danger,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  danger?: boolean;
}) {
  return (
    <DropdownMenu.Item
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer outline-none",
        "transition-colors duration-fast",
        danger
          ? "text-danger-text hover:bg-danger-bg"
          : "text-stone-700 hover:bg-stone-100",
        className
      )}
      onClick={onClick}
    >
      {children}
    </DropdownMenu.Item>
  );
}
