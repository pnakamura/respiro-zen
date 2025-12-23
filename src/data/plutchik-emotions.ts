// Modelo de Plutchik - 8 Emoções Primárias

export interface EmotionIntensity {
  id: string;
  label: string;
}

export interface PrimaryEmotion {
  id: string;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  opposite: string;
  lowIntensity: EmotionIntensity;
  midIntensity: EmotionIntensity;
  highIntensity: EmotionIntensity;
  survivalFunction: string;
  neurotransmitter: string;
  arousalState: 'hyperarousal' | 'hypoarousal' | 'balance';
}

export const primaryEmotions: PrimaryEmotion[] = [
  {
    id: 'joy',
    label: 'Alegria',
    icon: '😊',
    color: 'hsl(45, 100%, 50%)', // Amarelo
    bgColor: 'hsl(45, 100%, 90%)',
    opposite: 'sadness',
    lowIntensity: { id: 'serenity', label: 'Serenidade' },
    midIntensity: { id: 'joy', label: 'Alegria' },
    highIntensity: { id: 'ecstasy', label: 'Êxtase' },
    survivalFunction: 'Reprodução e reintegração',
    neurotransmitter: 'Dopamina + Serotonina',
    arousalState: 'balance',
  },
  {
    id: 'trust',
    label: 'Confiança',
    icon: '🤝',
    color: 'hsl(120, 60%, 60%)', // Verde claro
    bgColor: 'hsl(120, 60%, 90%)',
    opposite: 'disgust',
    lowIntensity: { id: 'acceptance', label: 'Aceitação' },
    midIntensity: { id: 'trust', label: 'Confiança' },
    highIntensity: { id: 'admiration', label: 'Admiração' },
    survivalFunction: 'Afiliação e cooperação',
    neurotransmitter: 'Oxitocina',
    arousalState: 'balance',
  },
  {
    id: 'fear',
    label: 'Medo',
    icon: '😨',
    color: 'hsl(120, 100%, 25%)', // Verde escuro
    bgColor: 'hsl(120, 100%, 90%)',
    opposite: 'anger',
    lowIntensity: { id: 'apprehension', label: 'Apreensão' },
    midIntensity: { id: 'fear', label: 'Medo' },
    highIntensity: { id: 'terror', label: 'Terror' },
    survivalFunction: 'Proteção e fuga',
    neurotransmitter: 'Cortisol + Adrenalina',
    arousalState: 'hyperarousal',
  },
  {
    id: 'surprise',
    label: 'Surpresa',
    icon: '😲',
    color: 'hsl(180, 100%, 40%)', // Ciano
    bgColor: 'hsl(180, 100%, 90%)',
    opposite: 'anticipation',
    lowIntensity: { id: 'distraction', label: 'Distração' },
    midIntensity: { id: 'surprise', label: 'Surpresa' },
    highIntensity: { id: 'amazement', label: 'Assombro' },
    survivalFunction: 'Orientação ao novo',
    neurotransmitter: 'Noradrenalina',
    arousalState: 'balance',
  },
  {
    id: 'sadness',
    label: 'Tristeza',
    icon: '😢',
    color: 'hsl(220, 70%, 50%)', // Azul
    bgColor: 'hsl(220, 70%, 90%)',
    opposite: 'joy',
    lowIntensity: { id: 'pensiveness', label: 'Pensatividade' },
    midIntensity: { id: 'sadness', label: 'Tristeza' },
    highIntensity: { id: 'grief', label: 'Luto' },
    survivalFunction: 'Reintegração e pedido de ajuda',
    neurotransmitter: 'Baixa Serotonina',
    arousalState: 'hypoarousal',
  },
  {
    id: 'disgust',
    label: 'Aversão',
    icon: '🤢',
    color: 'hsl(270, 50%, 60%)', // Roxo
    bgColor: 'hsl(270, 50%, 90%)',
    opposite: 'trust',
    lowIntensity: { id: 'boredom', label: 'Tédio' },
    midIntensity: { id: 'disgust', label: 'Aversão' },
    highIntensity: { id: 'loathing', label: 'Repugnância' },
    survivalFunction: 'Rejeição de nocivos',
    neurotransmitter: 'Serotonina (inibição)',
    arousalState: 'hypoarousal',
  },
  {
    id: 'anger',
    label: 'Raiva',
    icon: '😠',
    color: 'hsl(15, 100%, 50%)', // Vermelho-laranja
    bgColor: 'hsl(15, 100%, 90%)',
    opposite: 'fear',
    lowIntensity: { id: 'annoyance', label: 'Aborrecimento' },
    midIntensity: { id: 'anger', label: 'Raiva' },
    highIntensity: { id: 'rage', label: 'Fúria' },
    survivalFunction: 'Destruição de barreiras',
    neurotransmitter: 'Noradrenalina + Baixa Serotonina',
    arousalState: 'hyperarousal',
  },
  {
    id: 'anticipation',
    label: 'Antecipação',
    icon: '🔮',
    color: 'hsl(30, 100%, 50%)', // Laranja
    bgColor: 'hsl(30, 100%, 90%)',
    opposite: 'surprise',
    lowIntensity: { id: 'interest', label: 'Interesse' },
    midIntensity: { id: 'anticipation', label: 'Antecipação' },
    highIntensity: { id: 'vigilance', label: 'Vigilância' },
    survivalFunction: 'Exploração e planejamento',
    neurotransmitter: 'Dopamina',
    arousalState: 'balance',
  },
];

// Díades Primárias (emoções adjacentes na roda)
export interface EmotionDyad {
  emotions: [string, string];
  result: string;
  label: string;
  description: string;
}

export const primaryDyads: EmotionDyad[] = [
  { emotions: ['joy', 'trust'], result: 'love', label: 'Amor', description: 'União de alegria e confiança' },
  { emotions: ['trust', 'fear'], result: 'submission', label: 'Submissão', description: 'Confiança misturada com medo' },
  { emotions: ['fear', 'surprise'], result: 'awe', label: 'Temor Reverencial', description: 'Medo diante do desconhecido' },
  { emotions: ['surprise', 'sadness'], result: 'disapproval', label: 'Desaprovação', description: 'Surpresa negativa' },
  { emotions: ['sadness', 'disgust'], result: 'remorse', label: 'Remorso', description: 'Tristeza por ações passadas' },
  { emotions: ['disgust', 'anger'], result: 'contempt', label: 'Desprezo', description: 'Aversão ativa' },
  { emotions: ['anger', 'anticipation'], result: 'aggressiveness', label: 'Agressividade', description: 'Raiva direcionada' },
  { emotions: ['anticipation', 'joy'], result: 'optimism', label: 'Otimismo', description: 'Expectativa positiva' },
];

// Díades Secundárias (uma emoção entre as duas)
export const secondaryDyads: EmotionDyad[] = [
  { emotions: ['joy', 'fear'], result: 'guilt', label: 'Culpa', description: 'Alegria inibida por medo' },
  { emotions: ['trust', 'surprise'], result: 'curiosity', label: 'Curiosidade', description: 'Abertura ao inesperado' },
  { emotions: ['fear', 'sadness'], result: 'despair', label: 'Desespero', description: 'Medo sem esperança' },
  { emotions: ['surprise', 'disgust'], result: 'unbelief', label: 'Incredulidade', description: 'Choque com rejeição' },
  { emotions: ['sadness', 'anger'], result: 'envy', label: 'Inveja', description: 'Tristeza com ressentimento' },
  { emotions: ['disgust', 'anticipation'], result: 'cynicism', label: 'Cinismo', description: 'Expectativa negativa' },
  { emotions: ['anger', 'joy'], result: 'pride', label: 'Orgulho', description: 'Satisfação assertiva' },
  { emotions: ['anticipation', 'trust'], result: 'hope', label: 'Esperança', description: 'Expectativa confiante' },
];

// Díades Terciárias (duas emoções entre as duas)
export const tertiaryDyads: EmotionDyad[] = [
  { emotions: ['joy', 'surprise'], result: 'delight', label: 'Encantamento', description: 'Alegria inesperada' },
  { emotions: ['trust', 'sadness'], result: 'sentimentality', label: 'Sentimentalismo', description: 'Confiança nostálgica' },
  { emotions: ['fear', 'disgust'], result: 'shame', label: 'Vergonha', description: 'Medo de rejeição' },
  { emotions: ['surprise', 'anger'], result: 'outrage', label: 'Indignação', description: 'Choque com raiva' },
  { emotions: ['sadness', 'anticipation'], result: 'pessimism', label: 'Pessimismo', description: 'Expectativa negativa' },
  { emotions: ['disgust', 'joy'], result: 'morbidness', label: 'Morbidez', description: 'Prazer no desagradável' },
  { emotions: ['anger', 'trust'], result: 'dominance', label: 'Dominância', description: 'Controle assertivo' },
  { emotions: ['anticipation', 'fear'], result: 'anxiety', label: 'Ansiedade', description: 'Antecipação temerosa' },
];

// Função para detectar díades baseado nas emoções selecionadas
export function detectDyads(selectedEmotionIds: string[]): EmotionDyad[] {
  const allDyads = [...primaryDyads, ...secondaryDyads, ...tertiaryDyads];
  const detected: EmotionDyad[] = [];

  for (const dyad of allDyads) {
    if (
      selectedEmotionIds.includes(dyad.emotions[0]) &&
      selectedEmotionIds.includes(dyad.emotions[1])
    ) {
      detected.push(dyad);
    }
  }

  return detected;
}

// Função para obter o label de intensidade baseado no valor (1-5)
export function getIntensityLabel(emotion: PrimaryEmotion, intensity: number): string {
  if (intensity <= 2) return emotion.lowIntensity.label;
  if (intensity <= 4) return emotion.midIntensity.label;
  return emotion.highIntensity.label;
}

// Função para obter emoção por ID
export function getEmotionById(id: string): PrimaryEmotion | undefined {
  return primaryEmotions.find(e => e.id === id);
}
