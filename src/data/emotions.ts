import { Emotion, MeditationTrack } from '@/types/breathing';

export const emotions: Emotion[] = [
  {
    id: 'anxious',
    label: 'Ansioso',
    description: 'Acalme a mente com respiração 4-7-8',
    icon: '😰',
    colorClass: 'text-calm',
    bgClass: 'bg-calm-light',
    pattern: {
      inhale: 4000,
      holdIn: 7000,
      exhale: 8000,
      holdOut: 0,
      name: 'Respiração 4-7-8',
      description: 'Inspire por 4s, segure por 7s, expire por 8s',
      cycles: 4,
    },
  },
  {
    id: 'angry',
    label: 'Estressado',
    description: 'Encontre equilíbrio com respiração quadrada',
    icon: '😤',
    colorClass: 'text-grounding',
    bgClass: 'bg-grounding-light',
    pattern: {
      inhale: 4000,
      holdIn: 4000,
      exhale: 4000,
      holdOut: 4000,
      name: 'Respiração Quadrada',
      description: 'Inspire 4s, segure 4s, expire 4s, segure 4s',
      cycles: 4,
    },
  },
  {
    id: 'tired',
    label: 'Cansado',
    description: 'Energize-se com respiração estimulante',
    icon: '😴',
    colorClass: 'text-energy',
    bgClass: 'bg-energy-light',
    pattern: {
      inhale: 4000,
      holdIn: 0,
      exhale: 2000,
      holdOut: 0,
      name: 'Respiração Energizante',
      description: 'Inspire profundo, expire rápido',
      cycles: 6,
    },
  },
  {
    id: 'panic',
    label: 'Pânico',
    description: 'Suspiro fisiológico para alívio rápido',
    icon: '😱',
    colorClass: 'text-panic',
    bgClass: 'bg-panic-light',
    pattern: {
      inhale: 2000,
      holdIn: 500,
      exhale: 6000,
      holdOut: 0,
      name: 'Suspiro Fisiológico',
      description: 'Dupla inspiração curta, expiração longa',
      cycles: 5,
    },
  },
  {
    id: 'meditate',
    label: 'Quero Meditar',
    description: 'Meditações guiadas para paz interior',
    icon: '🧘',
    colorClass: 'text-meditate',
    bgClass: 'bg-meditate-light',
    pattern: {
      inhale: 0,
      holdIn: 0,
      exhale: 0,
      holdOut: 0,
      name: 'Meditação',
      description: 'Escolha uma meditação guiada',
      cycles: 0,
    },
  },
];

export const meditationTracks: MeditationTrack[] = [
  {
    id: '1',
    title: '5 Minutos de Calma',
    duration: '5:00',
    durationMs: 300000,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    category: 'Relaxamento',
  },
  {
    id: '2',
    title: 'Sons da Natureza',
    duration: '10:00',
    durationMs: 600000,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    category: 'Natureza',
  },
  {
    id: '3',
    title: 'Atenção Plena',
    duration: '7:00',
    durationMs: 420000,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    category: 'Mindfulness',
  },
  {
    id: '4',
    title: 'Relaxamento Profundo',
    duration: '15:00',
    durationMs: 900000,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    category: 'Sono',
  },
];

export const getEmotionById = (id: string): Emotion | undefined => {
  return emotions.find(e => e.id === id);
};
