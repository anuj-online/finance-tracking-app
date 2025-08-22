import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    INR: '₹',
    EUR: '€',
    USD: '$',
    GBP: '£'
  };
  
  const symbol = symbols[currency] || currency;
  return `${symbol} ${amount.toLocaleString()}`;
}