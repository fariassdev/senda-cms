import { clsx, type ClassValue } from 'clsx';
import { differenceInDays, format, formatDistance } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a timestamp string for display.
 * API dates are in UTC (ISO 8601 with Z suffix), displayed in user's local timezone.
 * Uses relative format (e.g., "2 hours ago") for dates < 7 days old.
 * Uses absolute format (e.g., "Nov 28, 2025") for dates >= 7 days old.
 *
 * Example: If API returns "2025-11-30T23:23:42Z" and user is in UTC+1 viewing at
 * "2025-11-30T23:23:42" local time, shows "about 1 hour ago".
 */
export function formatTimestamp(dateString: string): string {
  const date = new Date(dateString); // UTC date from API
  const now = new Date(); // Local date
  const daysDiff = differenceInDays(now, date);

  if (daysDiff < 7) {
    return formatDistance(date, now, { addSuffix: true });
  }
  return format(date, 'MMM d, yyyy');
}
