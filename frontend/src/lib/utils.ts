import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge de classes Tailwind, typé sans any */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
