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

/**
 * Sanitize a string to be safe for use as a filename.
 * Replaces non-alphanumeric characters (except hyphens and underscores) with underscores.
 * Trims leading/trailing underscores and collapses multiple consecutive underscores.
 *
 * @param text - The text to sanitize
 * @returns A filesystem-safe string
 *
 * @example
 * sanitizeFilename("Hello World!") // "Hello_World"
 * sanitizeFilename("Lesson #1: Introduction") // "Lesson_1_Introduction"
 */
export function sanitizeFilename(text: string): string {
  return (
    text
      // Replace any character that's not alphanumeric, hyphen, or underscore with underscore
      .replace(/[^a-zA-Z0-9\-_]/g, '_')
      // Collapse multiple consecutive underscores into one
      .replace(/_+/g, '_')
      // Trim leading and trailing underscores
      .replace(/^_+|_+$/g, '')
  );
}
