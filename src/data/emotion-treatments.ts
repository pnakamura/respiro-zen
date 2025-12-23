// Mapeamento de Emoções para Tratamentos
// Baseado na Teoria Polivagal e protocolos de respiração

export interface BreathingPattern {
  inhale: number;
  holdIn?: number;
  exhale: number;
  holdOut?: number;
  inhale2?: number; // Para suspiro cíclico
}

export interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  pattern: BreathingPattern;
  cycles: number;
  evidence: string;
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

// Técnicas de Respiração
const cyclicSighing: BreathingTechnique = {
  id: 'cyclic-sighing',
  name: 'Suspiro Cíclico',
  description: 'Inspire profundamente pelo nariz, faça uma segunda inspiração curta, expire lentamente pela boca',
  pattern: { inhale: 3000, inhale2: 1000, exhale: 6000 },
  cycles: 5,
  evidence: 'Estudos de Andrew Huberman/Stanford (2023)',
};

const breathing478: BreathingTechnique = {
  id: '4-7-8',
  name: 'Respiração 4-7-8',
  description: 'Inspire por 4 segundos, segure por 7 segundos, expire por 8 segundos',
  pattern: { inhale: 4000, holdIn: 7000, exhale: 8000 },
  cycles: 4,
  evidence: 'Dr. Andrew Weil - Tradição Pranayama',
};

const boxBreathing: BreathingTechnique = {
  id: 'box-breathing',
  name: 'Respiração Quadrada',
  description: 'Inspire 4s, segure 4s, expire 4s, segure 4s - ritmo equilibrado',
  pattern: { inhale: 4000, holdIn: 4000, exhale: 4000, holdOut: 4000 },
  cycles: 4,
  evidence: 'Navy SEALs / Mark Divine',
};

const coherentBreathing: BreathingTechnique = {
  id: 'coherent',
  name: 'Respiração Coerente',
  description: 'Inspire 5 segundos, expire 5 segundos - 6 ciclos por minuto',
  pattern: { inhale: 5000, exhale: 5000 },
  cycles: 10,
  evidence: 'Heart Math Institute',
};

const kapalabhati: BreathingTechnique = {
  id: 'kapalabhati',
  name: 'Kapalabhati',
  description: 'Exalações vigorosas com inspirações passivas - energizante',
  pattern: { exhale: 500, inhale: 500 },
  cycles: 30,
  evidence: 'Tradição Yógica',
  contraindications: ['gravidez', 'hipertensão', 'ansiedade aguda', 'problemas cardíacos'],
};

const bhastrika: BreathingTechnique = {
  id: 'bhastrika',
  name: 'Bhastrika (Fole)',
  description: 'Inspiração e expiração vigorosas pelo nariz - ativação',
  pattern: { inhale: 1000, exhale: 1000 },
  cycles: 20,
  evidence: 'Tradição Yógica',
  contraindications: ['gravidez', 'hipertensão', 'ansiedade'],
};

const alternateNostril: BreathingTechnique = {
  id: 'alternate-nostril',
  name: 'Nadi Shodhana',
  description: 'Respiração alternada pelas narinas - equilíbrio',
  pattern: { inhale: 4000, holdIn: 4000, exhale: 4000 },
  cycles: 10,
  evidence: 'Tradição Yógica / Estudos de HRV',
};

// Meditações
const rainMeditation: MeditationType = {
  id: 'rain',
  name: 'Meditação RAIN',
  description: 'Reconhecer, Aceitar, Investigar, Nutrir - para emoções difíceis',
  duration: '10-15 min',
};

const mettaMeditation: MeditationType = {
  id: 'metta',
  name: 'Loving-Kindness (Metta)',
  description: 'Cultivar compaixão por si e pelos outros',
  duration: '10-20 min',
};

const bodyScan: MeditationType = {
  id: 'body-scan',
  name: 'Body Scan',
  description: 'Atenção progressiva às sensações corporais',
  duration: '15-30 min',
};

const mindfulness: MeditationType = {
  id: 'mindfulness',
  name: 'Mindfulness',
  description: 'Atenção plena ao momento presente',
  duration: '10-20 min',
};

const lettingGo: MeditationType = {
  id: 'letting-go',
  name: 'Letting Go (Hawkins)',
  description: 'Técnica de liberar emoções sem resistência',
  duration: '5-15 min',
};

// Categorias de Tratamento
export const treatmentCategories: TreatmentCategory[] = [
  {
    id: 'hyperarousal',
    label: 'Hiperativação',
    description: 'Sistema Simpático ativo (Luta/Fuga) - necessita acalmar',
    emotions: ['fear', 'anger'],
    dyads: ['anxiety', 'aggressiveness', 'rage', 'terror', 'outrage'],
    techniques: [cyclicSighing, breathing478, boxBreathing],
    meditations: [rainMeditation, mettaMeditation, bodyScan],
  },
  {
    id: 'hypoarousal',
    label: 'Hipoativação',
    description: 'Vagal Dorsal ativo (Congelamento/Shutdown) - necessita ativar',
    emotions: ['sadness', 'disgust'],
    dyads: ['despair', 'grief', 'shame', 'remorse', 'apathy', 'boredom'],
    techniques: [kapalabhati, bhastrika, coherentBreathing],
    meditations: [lettingGo, bodyScan, mindfulness],
  },
  {
    id: 'balance',
    label: 'Equilíbrio',
    description: 'Vagal Ventral - manter e fortalecer estado equilibrado',
    emotions: ['joy', 'trust', 'surprise', 'anticipation'],
    dyads: ['love', 'optimism', 'hope', 'curiosity', 'serenity'],
    techniques: [coherentBreathing, boxBreathing, alternateNostril],
    meditations: [mindfulness, mettaMeditation],
  },
];

// Função para obter tratamento recomendado baseado nas emoções
export function getRecommendedTreatment(
  emotionIds: string[],
  dyadIds: string[] = []
): TreatmentCategory | null {
  // Prioridade: hiperativação > hipoativação > equilíbrio
  for (const category of treatmentCategories) {
    const hasMatchingEmotion = emotionIds.some(id => category.emotions.includes(id));
    const hasMatchingDyad = dyadIds.some(id => category.dyads.includes(id));

    if (hasMatchingEmotion || hasMatchingDyad) {
      return category;
    }
  }

  // Default para equilíbrio
  return treatmentCategories.find(c => c.id === 'balance') || null;
}

// Função para obter técnica específica por ID
export function getTechniqueById(id: string): BreathingTechnique | undefined {
  for (const category of treatmentCategories) {
    const technique = category.techniques.find(t => t.id === id);
    if (technique) return technique;
  }
  return undefined;
}

// Mapear para padrão do BreathPacer existente
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
