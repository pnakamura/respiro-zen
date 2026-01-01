import { useMemo } from 'react';
import { useBreathingTechniques } from './useBreathingTechniques';
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

// Static meditation data (these could also come from DB in the future)
const meditationsByCategory: Record<string, MeditationType[]> = {
  hyperarousal: [
    { id: 'rain', name: 'Meditação RAIN', description: 'Reconhecer, Aceitar, Investigar, Nutrir - para emoções difíceis', duration: '10-15 min' },
    { id: 'metta', name: 'Loving-Kindness (Metta)', description: 'Cultivar compaixão por si e pelos outros', duration: '10-20 min' },
    { id: 'body-scan', name: 'Body Scan', description: 'Atenção progressiva às sensações corporais', duration: '15-30 min' },
  ],
  hypoarousal: [
    { id: 'letting-go', name: 'Letting Go (Hawkins)', description: 'Técnica de liberar emoções sem resistência', duration: '5-15 min' },
    { id: 'body-scan', name: 'Body Scan', description: 'Atenção progressiva às sensações corporais', duration: '15-30 min' },
    { id: 'mindfulness', name: 'Mindfulness', description: 'Atenção plena ao momento presente', duration: '10-20 min' },
  ],
  balance: [
    { id: 'mindfulness', name: 'Mindfulness', description: 'Atenção plena ao momento presente', duration: '10-20 min' },
    { id: 'metta', name: 'Loving-Kindness (Metta)', description: 'Cultivar compaixão por si e pelos outros', duration: '10-20 min' },
  ],
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

export function useTreatmentCategories() {
  const { data: dbTechniques, isLoading } = useBreathingTechniques();

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
  }, [dbTechniques]);

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
