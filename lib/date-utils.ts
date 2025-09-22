import { formatDistanceToNow } from "date-fns";

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
