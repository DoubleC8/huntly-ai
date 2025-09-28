import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import parsePhoneNumberFromString from "libphonenumber-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhoneForDisplay(phone: string): string {
  const phoneNumber = parsePhoneNumberFromString(phone);
  return phoneNumber ? phoneNumber.formatInternational() : phone;
}

export function formatEntry(entry: string): string {
  return entry
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function normalizeEntry(entry: string): string {
  return entry.trim().toLowerCase().replace(/\s+/g, " ");
}