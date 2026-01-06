import { useMemo } from 'react';
import { useBreathingTechniques } from './useBreathingTechniques';
import { useMeditationTracks, useMeditationCategories } from './useMeditationTracks';
import type { BreathingTechnique as DBBreathingTechnique } from '@/types/admin';

// Types for treatment system
export interface BreathingPattern {
  inhale: number;
  holdIn?: number;
  exhale: number;
  holdOut?: number;
  inhale2?: number;
}

export interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  pattern: BreathingPattern;
  cycles: number;
  evidence?: string;
  contraindications?: string[];
}

export interface MeditationType {
  id: string;
  name: string;
  description: string;
  duration: string;
}

export interface TreatmentCategory {
  id: 'hyperarousal' | 'hypoarousal' | 'balance';
  label: string;
  description: string;
  emotions: string[];
  dyads: string[];
  techniques: BreathingTechnique[];
  meditations: MeditationType[];
}

// Mapping from emotion_id to arousal category
const emotionToCategory: Record<string, 'hyperarousal' | 'hypoarousal' | 'balance'> = {
  // Hyperarousal (need calming)
  anxious: 'hyperarousal',
  angry: 'hyperarousal',
  panic: 'hyperarousal',
  // Hypoarousal (need energizing)
  tired: 'hypoarousal',
  wim_hof: 'hypoarousal', // Energizing technique
  // Balance
  alternate: 'balance',
  coherent: 'balance',
  meditate: 'balance',
};

// Mapping meditation categories to treatment types
const meditationCategoryToTreatment: Record<string, 'hyperarousal' | 'hypoarousal' | 'balance'> = {
  'relaxamento': 'hyperarousal',
  'sono': 'hyperarousal',
  'foco': 'hypoarousal',
  'natureza': 'balance',
  'guiada': 'balance',
};

// Emotions mapped to each category (for Plutchik detection)
const categoryEmotions: Record<string, string[]> = {
  hyperarousal: ['fear', 'anger'],
  hypoarousal: ['sadness', 'disgust'],
  balance: ['joy', 'trust', 'surprise', 'anticipation'],
};

const categoryDyads: Record<string, string[]> = {
  hyperarousal: ['anxiety', 'aggressiveness', 'rage', 'terror', 'outrage'],
  hypoarousal: ['despair', 'grief', 'shame', 'remorse', 'apathy', 'boredom'],
  balance: ['love', 'optimism', 'hope', 'curiosity', 'serenity'],
};

// Convert DB technique to treatment technique format
function dbTechniqueToTreatment(dbTechnique: DBBreathingTechnique): BreathingTechnique {
  return {
    id: dbTechnique.id,
    name: dbTechnique.pattern_name,
    description: dbTechnique.description,
    pattern: {
      inhale: dbTechnique.inhale_ms,
      holdIn: dbTechnique.hold_in_ms || undefined,
      exhale: dbTechnique.exhale_ms,
      holdOut: dbTechnique.hold_out_ms || undefined,
    },
    cycles: dbTechnique.cycles,
    evidence: dbTechnique.explanation || undefined,
  };
}

// Convert DB meditation to treatment meditation format
function dbMeditationToTreatment(dbMeditation: {
  id: string;
  title: string;
  description: string | null;
  duration_display: string;
}): MeditationType {
  return {
    id: dbMeditation.id,
    name: dbMeditation.title,
    description: dbMeditation.description || '',
    duration: dbMeditation.duration_display,
  };
}

export function useTreatmentCategories() {
  const { data: dbTechniques, isLoading: isLoadingTechniques } = useBreathingTechniques();
  const { data: dbMeditations, isLoading: isLoadingMeditations } = useMeditationTracks();
  const { data: meditationCategories } = useMeditationCategories();

  // Build meditation category name lookup
  const categoryNameById = useMemo(() => {
    const map: Record<string, string> = {};
    meditationCategories?.forEach(cat => {
      map[cat.id] = cat.name.toLowerCase();
    });
    return map;
  }, [meditationCategories]);

  // Group meditations by treatment category
  const meditationsByCategory = useMemo(() => {
    const result: Record<string, MeditationType[]> = {
      hyperarousal: [],
      hypoarousal: [],
      balance: [],
    };

    dbMeditations?.forEach(med => {
      const categoryName = med.category_id ? categoryNameById[med.category_id] : '';
      const treatmentType = meditationCategoryToTreatment[categoryName] || 'balance';
      result[treatmentType].push(dbMeditationToTreatment(med));
    });

    return result;
  }, [dbMeditations, categoryNameById]);

  const treatmentCategories = useMemo<TreatmentCategory[]>(() => {
    if (!dbTechniques || dbTechniques.length === 0) {
      return [];
    }

    // Group techniques by category
    const techniquesByCategory: Record<string, BreathingTechnique[]> = {
      hyperarousal: [],
      hypoarousal: [],
      balance: [],
    };

    dbTechniques.forEach(dbTech => {
      const category = emotionToCategory[dbTech.emotion_id] || 'balance';
      techniquesByCategory[category].push(dbTechniqueToTreatment(dbTech));
    });

    return [
      {
        id: 'hyperarousal',
        label: 'Hiperativação',
        description: 'Sistema Simpático ativo (Luta/Fuga) - necessita acalmar',
        emotions: categoryEmotions.hyperarousal,
        dyads: categoryDyads.hyperarousal,
        techniques: techniquesByCategory.hyperarousal,
        meditations: meditationsByCategory.hyperarousal,
      },
      {
        id: 'hypoarousal',
        label: 'Hipoativação',
        description: 'Vagal Dorsal ativo (Congelamento/Shutdown) - necessita ativar',
        emotions: categoryEmotions.hypoarousal,
        dyads: categoryDyads.hypoarousal,
        techniques: techniquesByCategory.hypoarousal,
        meditations: meditationsByCategory.hypoarousal,
      },
      {
        id: 'balance',
        label: 'Equilíbrio',
        description: 'Vagal Ventral - manter e fortalecer estado equilibrado',
        emotions: categoryEmotions.balance,
        dyads: categoryDyads.balance,
        techniques: techniquesByCategory.balance,
        meditations: meditationsByCategory.balance,
      },
    ];
  }, [dbTechniques, meditationsByCategory]);

  const isLoading = isLoadingTechniques || isLoadingMeditations;

  // Get recommended treatment based on emotions
  const getRecommendedTreatment = useMemo(() => {
    return (emotionIds: string[], dyadIds: string[] = []): TreatmentCategory | null => {
      if (treatmentCategories.length === 0) return null;

      // Priority: hyperarousal > hypoarousal > balance
      for (const category of treatmentCategories) {
        const hasMatchingEmotion = emotionIds.some(id => category.emotions.includes(id));
        const hasMatchingDyad = dyadIds.some(id => category.dyads.includes(id));

        if (hasMatchingEmotion || hasMatchingDyad) {
          return category;
        }
      }

      // Default to balance
      return treatmentCategories.find(c => c.id === 'balance') || null;
    };
  }, [treatmentCategories]);

  // Get technique by ID
  const getTechniqueById = useMemo(() => {
    return (id: string): BreathingTechnique | undefined => {
      for (const category of treatmentCategories) {
        const technique = category.techniques.find(t => t.id === id);
        if (technique) return technique;
      }
      return undefined;
    };
  }, [treatmentCategories]);

  return {
    treatmentCategories,
    getRecommendedTreatment,
    getTechniqueById,
    isLoading,
  };
}

// Convert technique to BreathPacer pattern format
export function techniqueToBreathPattern(technique: BreathingTechnique) {
  return {
    inhale: technique.pattern.inhale,
    holdIn: technique.pattern.holdIn || 0,
    exhale: technique.pattern.exhale,
    holdOut: technique.pattern.holdOut || 0,
    name: technique.name,
    description: technique.description,
    cycles: technique.cycles,
  };
}
