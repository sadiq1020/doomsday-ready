/**
 * Formats a duration in minutes into a concise "Xh Ym" notation.
 *
 * Examples:
 * - 432 -> "7h 12m"
 * - 126 -> "2h 6m"
 * - 60  -> "1h"
 * - 45  -> "45m"
 * - 0   -> "0m"
 */
export function formatRuntime(minutes: number): string {
  if (typeof minutes !== "number" || isNaN(minutes) || minutes <= 0) {
    return "0m";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0 && remainingMinutes > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }

  if (hours > 0) {
    return `${hours}h`;
  }

  return `${remainingMinutes}m`;
}

