"use client";
import { useState, useRef, useEffect, useId, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
};

interface SearchSelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  hasError?: boolean;
}

export function SearchSelect({
  options,
  value,
  onChange,
  placeholder = "Pilih...",
  searchPlaceholder = "Cari...",
  disabled = false,
  hasError = false,
}: SearchSelectProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [focused, setFocused] = useState(-1);

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return q
      ? options.filter((o) => o.label.toLowerCase().includes(q))
      : options;
  }, [options, query]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
      setFocused(-1);
    } else {
      setQuery("");
    }
  }, [open]);

  // Reset focused index when filter changes
  useEffect(() => {
    setFocused(-1);
  }, [query]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (e.key) {
      case "Escape":
        setOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocused((f) => Math.min(f + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocused((f) => Math.max(f - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (focused >= 0 && filtered[focused]) {
          select(filtered[focused].value);
        }
        break;
    }
  }

  // Scroll focused item into view
  useEffect(() => {
    if (focused < 0 || !listRef.current) return;
    const item = listRef.current.children[focused] as HTMLElement;
    item?.scrollIntoView({ block: "nearest" });
  }, [focused]);

  function select(val: string) {
    onChange(val);
    setOpen(false);
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange("");
  }

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      {/* Trigger */}
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "w-full h-10 px-3 flex items-center justify-between gap-2 rounded-md text-sm border bg-white transition-all",
          "focus:outline-none focus:border-teal focus:shadow-focus",
          disabled && "opacity-50 cursor-not-allowed bg-stone-50",
          hasError
            ? "border-danger-bold"
            : open
              ? "border-teal-600 shadow-focus"
              : "border-stone-200 hover:border-stone-300",
        )}
      >
        <span className={cn("truncate", !selected && "text-stone-400")}>
          {selected ? selected.label : placeholder}
        </span>

        <span className="flex items-center gap-0.5 shrink-0">
          {selected && (
            <span
              role="button"
              onClick={clear}
              className="p-0.5 rounded text-stone-300 hover:text-stone-500 hover:bg-stone-100 transition-colors"
            >
              <X size={12} />
            </span>
          )}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.18 }}
            className="text-stone-400"
          >
            <ChevronDown size={14} />
          </motion.span>
        </span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute z-50 top-[calc(100%+4px)] left-0 right-0 bg-white border border-stone-200 rounded-lg shadow-modal overflow-hidden"
          >
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-stone-100">
              <Search size={13} className="text-stone-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="flex-1 text-sm bg-transparent outline-none text-stone-800 placeholder:text-stone-400 focus:shadow-none shadow-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-stone-300 hover:text-stone-500 transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Options */}
            <ul
              ref={listRef}
              role="listbox"
              className="max-h-52 overflow-y-auto py-1"
            >
              {filtered.length === 0 ? (
                <li className="px-3 py-6 text-center text-xs text-stone-400">
                  Tidak ditemukan
                </li>
              ) : (
                filtered.map((opt, i) => {
                  const isSelected = opt.value === value;
                  const isFocused = i === focused;
                  return (
                    <li
                      key={opt.value}
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setFocused(i)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        select(opt.value);
                      }}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors",
                        isFocused ? "bg-stone-50" : "",
                        isSelected ? "text-teal-700" : "text-stone-800",
                      )}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        <Check size={13} className="text-teal-600 shrink-0" />
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
