import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  COMPLETE: 'ethra_onboarding_complete',
  GOALS: 'ethra_user_goals',
  EXPERIENCE: 'ethra_experience_level',
  TIME: 'ethra_preferred_time',
};

export type UserGoal = 
  | 'reduce_stress'
  | 'sleep_better'
  | 'focus'
  | 'self_knowledge'
  | 'emotional_balance'
  | 'mindfulness';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type PreferredTime = 'morning' | 'lunch' | 'evening' | 'bedtime' | 'anytime';

export interface OnboardingPreferences {
  goals: UserGoal[];
  experienceLevel: ExperienceLevel | null;
  preferredTime: PreferredTime | null;
}

export interface UseOnboardingReturn {
  isComplete: boolean;
  isLoading: boolean;
  preferences: OnboardingPreferences;
  currentStep: number;
  totalSteps: number;
  setCurrentStep: (step: number) => void;
  setGoals: (goals: UserGoal[]) => void;
  setExperienceLevel: (level: ExperienceLevel) => void;
  setPreferredTime: (time: PreferredTime) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export function useOnboarding(): UseOnboardingReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<OnboardingPreferences>({
    goals: [],
    experienceLevel: null,
    preferredTime: null,
  });

  const totalSteps = 6;

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const complete = localStorage.getItem(STORAGE_KEYS.COMPLETE) === 'true';
      const goals = JSON.parse(localStorage.getItem(STORAGE_KEYS.GOALS) || '[]');
      const experienceLevel = localStorage.getItem(STORAGE_KEYS.EXPERIENCE) as ExperienceLevel | null;
      const preferredTime = localStorage.getItem(STORAGE_KEYS.TIME) as PreferredTime | null;

      setIsComplete(complete);
      setPreferences({
        goals,
        experienceLevel,
        preferredTime,
      });
    } catch (error) {
      console.error('Error loading onboarding state:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setGoals = useCallback((goals: UserGoal[]) => {
    setPreferences(prev => ({ ...prev, goals }));
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, []);

  const setExperienceLevel = useCallback((level: ExperienceLevel) => {
    setPreferences(prev => ({ ...prev, experienceLevel: level }));
    localStorage.setItem(STORAGE_KEYS.EXPERIENCE, level);
  }, []);

  const setPreferredTime = useCallback((time: PreferredTime) => {
    setPreferences(prev => ({ ...prev, preferredTime: time }));
    localStorage.setItem(STORAGE_KEYS.TIME, time);
  }, []);

  const completeOnboarding = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETE, 'true');
    setIsComplete(true);
  }, []);

  const resetOnboarding = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    setIsComplete(false);
    setCurrentStep(0);
    setPreferences({
      goals: [],
      experienceLevel: null,
      preferredTime: null,
    });
  }, []);

  return {
    isComplete,
    isLoading,
    preferences,
    currentStep,
    totalSteps,
    setCurrentStep,
    setGoals,
    setExperienceLevel,
    setPreferredTime,
    completeOnboarding,
    resetOnboarding,
  };
}
