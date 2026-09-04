import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value?: number | null): string {
  if (!value && value !== 0) return "";
  return new Intl.NumberFormat().format(Math.abs(value));
}
