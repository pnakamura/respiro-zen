import { useState, useEffect, useCallback } from 'react';

export type FontScale = 'normal' | 'large' | 'xlarge';

interface AccessibilitySettings {
  fontScale: FontScale;
}

const STORAGE_KEY = 'ethra-accessibility';

const defaultSettings: AccessibilitySettings = {
  fontScale: 'normal',
};

const fontScaleClasses: Record<FontScale, string> = {
  normal: '',
  large: 'font-scale-large',
  xlarge: 'font-scale-xlarge',
};

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AccessibilitySettings;
        setSettings(parsed);
        applyFontScale(parsed.fontScale);
      }
    } catch (e) {
      console.error('Failed to load accessibility settings:', e);
    }
  }, []);

  // Apply font scale class to document
  const applyFontScale = useCallback((scale: FontScale) => {
    if (typeof document === 'undefined') return;

    const html = document.documentElement;
    
    // Remove all font scale classes
    Object.values(fontScaleClasses).forEach((cls) => {
      if (cls) html.classList.remove(cls);
    });

    // Add new class if not normal
    const newClass = fontScaleClasses[scale];
    if (newClass) {
      html.classList.add(newClass);
    }
  }, []);

  // Update font scale
  const setFontScale = useCallback((scale: FontScale) => {
    const newSettings = { ...settings, fontScale: scale };
    setSettings(newSettings);
    applyFontScale(scale);

    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      } catch (e) {
        console.error('Failed to save accessibility settings:', e);
      }
    }
  }, [settings, applyFontScale]);

  return {
    fontScale: settings.fontScale,
    setFontScale,
    mounted,
  };
}

// Initialize accessibility settings on app load
export function initAccessibility() {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const { fontScale } = JSON.parse(stored) as AccessibilitySettings;
      const cls = fontScaleClasses[fontScale];
      if (cls) {
        document.documentElement.classList.add(cls);
      }
    }
  } catch (e) {
    // Silent fail
  }
}
