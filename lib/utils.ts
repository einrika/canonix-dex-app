import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toMicroAmount(amount: number | string, decimals: number): string {
  const a = typeof amount === 'string' ? parseFloat(amount) : amount;
  return Math.floor(a * Math.pow(10, decimals)).toString();
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
}
