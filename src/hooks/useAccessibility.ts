import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [mounted, setMounted] = useState(false);
  const [syncing, setSyncing] = useState(false);

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

  // Save to localStorage
  const saveToLocalStorage = useCallback((newSettings: AccessibilitySettings) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      } catch (e) {
        console.error('Failed to save accessibility settings to localStorage:', e);
      }
    }
  }, []);

  // Load from localStorage
  const loadFromLocalStorage = useCallback((): AccessibilitySettings => {
    if (typeof window === 'undefined') return defaultSettings;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as AccessibilitySettings;
      }
    } catch (e) {
      console.error('Failed to load accessibility settings from localStorage:', e);
    }
    return defaultSettings;
  }, []);

  // Load from Supabase
  const loadFromSupabase = useCallback(async (userId: string): Promise<AccessibilitySettings | null> => {
    try {
      const { data, error } = await supabase
        .from('user_accessibility_settings')
        .select('font_scale')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error loading accessibility settings from Supabase:', error);
        return null;
      }

      if (data) {
        return { fontScale: data.font_scale as FontScale };
      }
      return null;
    } catch (e) {
      console.error('Failed to load accessibility settings from Supabase:', e);
      return null;
    }
  }, []);

  // Save to Supabase
  const saveToSupabase = useCallback(async (userId: string, newSettings: AccessibilitySettings) => {
    setSyncing(true);
    try {
      const { error } = await supabase
        .from('user_accessibility_settings')
        .upsert({
          user_id: userId,
          font_scale: newSettings.fontScale,
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving accessibility settings to Supabase:', error);
      }
    } catch (e) {
      console.error('Failed to save accessibility settings to Supabase:', e);
    } finally {
      setSyncing(false);
    }
  }, []);

  // Load settings on mount and when user changes
  useEffect(() => {
    setMounted(true);
    
    const loadSettings = async () => {
      // Always start with localStorage (prevents flash)
      const localSettings = loadFromLocalStorage();
      setSettings(localSettings);
      applyFontScale(localSettings.fontScale);

      // If user is logged in, sync with Supabase
      if (user?.id) {
        const supabaseSettings = await loadFromSupabase(user.id);
        
        if (supabaseSettings) {
          // Supabase is source of truth for logged users
          setSettings(supabaseSettings);
          applyFontScale(supabaseSettings.fontScale);
          saveToLocalStorage(supabaseSettings);
        } else {
          // First login - save local settings to Supabase
          await saveToSupabase(user.id, localSettings);
        }
      }
    };

    loadSettings();
  }, [user?.id, loadFromLocalStorage, loadFromSupabase, applyFontScale, saveToLocalStorage, saveToSupabase]);

  // Update font scale
  const setFontScale = useCallback(async (scale: FontScale) => {
    const newSettings = { ...settings, fontScale: scale };
    setSettings(newSettings);
    applyFontScale(scale);
    saveToLocalStorage(newSettings);

    // Sync to Supabase if logged in
    if (user?.id) {
      await saveToSupabase(user.id, newSettings);
    }
  }, [settings, applyFontScale, saveToLocalStorage, saveToSupabase, user?.id]);

  return {
    fontScale: settings.fontScale,
    setFontScale,
    mounted,
    syncing,
  };
}

// Initialize accessibility settings on app load (prevents flash)
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
