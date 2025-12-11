import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove all non-word chars except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces and multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export function formatCurrency(amount: number, currencySymbol: string = '£'): string {
  // Ensure amount is treated as a number and handles potential null/undefined gracefully
  const numericAmount = amount ?? 0;
  return `${currencySymbol}${numericAmount.toFixed(2)}`;
}