export type EmotionType = 'anxious' | 'angry' | 'tired' | 'panic' | 'meditate' | 'wimhof' | 'alternate' | 'coherent';

export interface BreathPattern {
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
  name: string;
  description: string;
  cycles: number;
}

export interface Emotion {
  id: EmotionType;
  label: string;
  description: string;
  explanation: string;
  icon: string;
  colorClass: string;
  bgClass: string;
  pattern: BreathPattern;
}

export type BreathPhase = 'idle' | 'inhale' | 'holdIn' | 'exhale' | 'holdOut' | 'complete';

export interface MeditationTrack {
  id: string;
  title: string;
  duration: string;
  durationMs: number;
  audioUrl: string;
  category: string;
}
