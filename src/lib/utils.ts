import { clsx, type ClassValue } from 'clsx';
import { differenceInDays, format, formatDistance } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a timestamp string for display.
 * Uses relative format (e.g., "2 hours ago") for dates < 7 days old.
 * Uses absolute format (e.g., "Nov 28, 2025") for dates >= 7 days old.
 */
export function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const daysDiff = differenceInDays(now, date);

  if (daysDiff < 7) {
    return formatDistance(date, now, { addSuffix: true });
  }
  return format(date, 'MMM d, yyyy');
}
