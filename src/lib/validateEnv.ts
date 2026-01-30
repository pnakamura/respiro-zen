/**
 * Validates that all required environment variables are present
 * Throws an error on app startup if any are missing
 */

export function validateEnv(): void {
  const missing: string[] = [];

  // Required
  if (!import.meta.env.VITE_SUPABASE_URL) {
    missing.push('VITE_SUPABASE_URL');
  }

  // Accept either key name for backwards compatibility
  const hasPublishable = Boolean(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
  const hasAnon = Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY);
  if (!hasPublishable && !hasAnon) {
    missing.push('VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY)');
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}\n\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
}
