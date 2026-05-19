import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return format(new Date(date), "d MMM yyyy", { locale: id });
}

export function formatRelative(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: id });
}

export function truncate(str: string, len: number) {
  return str.length > len ? str.slice(0, len) + "..." : str;
}

export const MAPEL_COLORS: Record<
  string,
  "teal" | "violet" | "warning" | "info" | "stone"
> = {
  Matematika: "info",
  IPA: "teal",
  IPS: "warning",
  "Bahasa Indonesia": "warning",
  "Bahasa Inggris": "info",
  PPKn: "violet",
  "Seni Budaya": "violet",
  PJOK: "teal",
  default: "stone",
};

export function getMapelColor(mapel: string) {
  return MAPEL_COLORS[mapel] ?? MAPEL_COLORS["default"];
}
