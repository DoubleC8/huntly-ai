import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { prisma } from "@/lib/prisma";
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

export async function updateUserArrayEntry(
  email: string, 
  field: "skills" | "jobPreferences", 
  values: string | string[],
  mode: "update" | "remove"
){
  const user = await prisma.user.findUnique({
    where: { email },
    select: { [field]: true }
  });

  if (!user) throw new Error("User not found");

  const currentValues = (user as any)[field] as string[];
  let updatedValues: string[];

  switch (mode) {
    case "update": {
      const inputValues = Array.isArray(values) ? values : [values];
      const normalized = inputValues.map(normalizeEntry);

      updatedValues = Array.from(new Set([...currentValues, ...normalized]));
      break;
    }
    case "remove": {
      const inputValues = Array.isArray(values) ? values : [values];
      const normalized = inputValues.map(normalizeEntry);

      updatedValues = currentValues.filter((v) => !normalized.includes(v));
      break;
    }
    default:
      throw new Error(`Unsupported mode: ${mode}`);
  }

  const updatedUser = await prisma.user.update({
    where: { email },
    data: { [field]: updatedValues },
  });

  return updatedUser[field] as string[];
}