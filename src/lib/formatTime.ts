/**
 * Format a date as a relative time string (e.g., "Agora", "5min atrás", "Ontem")
 * @param date The date to format
 * @returns A human-readable relative time string
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Just now (< 30 seconds)
  if (diffSeconds < 30) {
    return 'Agora';
  }

  // Less than 1 minute
  if (diffSeconds < 60) {
    return `${diffSeconds}s atrás`;
  }

  // Less than 1 hour
  if (diffMinutes < 60) {
    return `${diffMinutes}min atrás`;
  }

  // Less than 24 hours
  if (diffHours < 24) {
    return `${diffHours}h atrás`;
  }

  // Yesterday
  if (diffDays === 1) {
    return 'Ontem';
  }

  // Less than 7 days
  if (diffDays < 7) {
    return `${diffDays} dias atrás`;
  }

  // Format as date
  return formatShortDate(date);
}

/**
 * Format a date as a short date string (e.g., "12 Jan")
 * @param date The date to format
 * @returns A short date string
 */
export function formatShortDate(date: Date): string {
  const months = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];

  return `${day} ${month}`;
}

/**
 * Format a date as a full time string (e.g., "14:35")
 * @param date The date to format
 * @returns A time string in HH:MM format
 */
export function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

/**
 * Format a date as a full date and time string (e.g., "12 Jan, 14:35")
 * @param date The date to format
 * @returns A full date and time string
 */
export function formatFullDateTime(date: Date): string {
  return `${formatShortDate(date)}, ${formatTime(date)}`;
}

/**
 * Check if a date is today
 * @param date The date to check
 * @returns True if the date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is yesterday
 * @param date The date to check
 * @returns True if the date is yesterday
 */
export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}
