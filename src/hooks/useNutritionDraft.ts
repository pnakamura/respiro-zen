type Step = 'mood' | 'hunger' | 'category' | 'energy' | 'notes' | 'success';

export interface NutritionDraft {
  step: Step;
  selectedMood: string | null;
  selectedHunger: string | null;
  selectedCategory: string | null;
  selectedEnergy: string | null;
  notes: string;
  savedAt: number;
}

const STORAGE_KEY = 'nutrition-check-in-draft';
const EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export function useNutritionDraft() {
  const saveDraft = (data: Omit<NutritionDraft, 'savedAt'>) => {
    try {
      const draft: NutritionDraft = {
        ...data,
        savedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch (error) {
      console.warn('Failed to save nutrition draft:', error);
    }
  };

  const loadDraft = (): NutritionDraft | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const draft: NutritionDraft = JSON.parse(stored);
      
      // Check if draft has expired (1 hour)
      if (Date.now() - draft.savedAt > EXPIRY_MS) {
        clearDraft();
        return null;
      }

      return draft;
    } catch (error) {
      console.warn('Failed to load nutrition draft:', error);
      return null;
    }
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear nutrition draft:', error);
    }
  };

  const hasDraft = (): boolean => {
    const draft = loadDraft();
    return draft !== null && ['category', 'energy', 'notes'].includes(draft.step);
  };

  return { saveDraft, loadDraft, clearDraft, hasDraft };
}
