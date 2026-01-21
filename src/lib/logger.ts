/**
 * Production-safe logging utility
 *
 * In development: logs to console
 * In production: only logs errors (can be extended to send to error tracking service)
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Log informational messages (development only)
   */
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log warning messages (development only)
   */
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Log error messages (always logged)
   * TODO: Send to error tracking service in production
   */
  error: (...args: unknown[]) => {
    console.error(...args);

    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // if (!isDevelopment) {
    //   trackError(...args);
    // }
  },

  /**
   * Debug messages (development only)
   */
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};
