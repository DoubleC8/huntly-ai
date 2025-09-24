import { parsePhoneNumberFromString } from "libphonenumber-js";

// Normalize to E.164 format (+14155551234)
export function normalizePhoneNumber(input: string): string | null {
  try {
    const phoneNumber = parsePhoneNumberFromString(input, "US"); // Default region can be configurable
    return phoneNumber ? phoneNumber.number : null; // E.164 format
  } catch {
    return null;
  }
}