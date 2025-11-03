import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { prisma } from "@/lib/prisma";
import parsePhoneNumberFromString from "libphonenumber-js";
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { formatDistanceToNow } from "date-fns";


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

  const currentValues = (user as Record<string, unknown>)[field] as string[];
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
      const normalizedToRemove = inputValues.map(normalizeEntry);

      // Normalize both the current values and the values to remove for comparison
      updatedValues = currentValues.filter((v) => {
        const normalizedCurrent = normalizeEntry(v);
        return !normalizedToRemove.includes(normalizedCurrent);
      });
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

export async function validateJobOwnership(jobId: string, userEmail: string){
  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) throw new Error("User not found");

  const job = await prisma.job.findUnique({where: { id: jobId }});
  if(!job || job.userId !== user.id) throw new Error("Unauthorized job access");

  return job;
}

export function formatResumeTitle(title: string): string {
  return title.split(".")[0];
}

export function formatTimestamp() {
  return `On ${format(new Date(), "PPP p", { locale: enUS })}`;
}

export function normalizePhoneNumber(input: string): string | null {
  try {
    const phoneNumber = parsePhoneNumberFromString(input, "US"); // Default region can be configurable
    return phoneNumber ? phoneNumber.number : null; // E.164 format
  } catch {
    return null;
  }
}

// Utility function to ensure consistent date formatting between server and client
export function formatJobDate(date: Date | string | null): string {
  if (!date) return "Unknown";
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Use a fixed reference time to ensure server/client consistency
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  
  // If the date is in the future or very recent (less than 1 minute), show "Just now"
  if (diffInMs < 60000) {
    return "Just now";
  }
  
  // For dates more than 1 minute ago, use formatDistanceToNow with consistent options
  return formatDistanceToNow(dateObj, { 
    addSuffix: true,
    includeSeconds: false
  });
}

// Utility function for consistent number formatting
export function formatSalary(amount: number | null): string {
  if (amount === null || amount === undefined) return "0";
  return amount.toLocaleString('en-US');
}