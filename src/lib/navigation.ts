import { NavigateFunction } from 'react-router-dom';

/**
 * Safely navigates back in history, with a fallback path if no history exists.
 * This prevents users from getting stuck on pages with no back navigation.
 */
export const safeGoBack = (
  navigate: NavigateFunction, 
  fallbackPath: string = '/'
) => {
  if (window.history.length > 2) {
    navigate(-1);
  } else {
    navigate(fallbackPath);
  }
};
