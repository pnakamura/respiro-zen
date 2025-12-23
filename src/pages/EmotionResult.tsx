import { motion } from 'framer-motion';
import { ArrowLeft, Play, Clock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface DetectedEmotion {
  name: string;
  percentage: number;
  color: string;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: string;
  type: 'breathing' | 'meditation';
}

const mockEmotions: DetectedEmotion[] = [
  { name: 'Ansiedade', percentage: 65, color: 'bg-panic' },
  { name: 'Estresse', percentage: 45, color: 'bg-energy' },
  { name: 'Cansaço', percentage: 30, color: 'bg-grounding' },
];

const recommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Respiração 4-7-8',
    description: 'Acalme sua mente com esta técnica relaxante',
    duration: '5 min',
    icon: '🌬️',
    type: 'breathing',
  },
  {
    id: '2',
    title: 'Meditação Guiada',
    description: 'Encontre paz interior com orientação suave',
    duration: '10 min',
    icon: '🧘',
    type: 'meditation',
  },
  {
    id: '3',
    title: 'Respiração Box',
    description: 'Equilibre suas emoções com respiração quadrada',
    duration: '4 min',
    icon: '📦',
    type: 'breathing',
  },
];

export default function EmotionResult() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Would receive from previous page via state
  const mainEmotion = location.state?.mainEmotion || 'Ansiedade';
  const mainEmoji = location.state?.mainEmoji || '😰';

  const handleStartRecommendation = (rec: Recommendation) => {
    // Navigate back to home and trigger the appropriate activity
    navigate('/', { state: { startActivity: rec.type, activityId: rec.id } });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Resultado</h1>
          <div className="w-9" />
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-6 space-y-8">
        {/* Main Emotion Circle */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="flex flex-col items-center"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-panic/20 to-panic/40 flex items-center justify-center shadow-lg">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="text-6xl"
            >
              {mainEmoji}
            </motion.span>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-2xl font-bold text-foreground"
          >
            {mainEmotion}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-2 text-sm text-muted-foreground text-center max-w-xs"
          >
            Baseado nas suas respostas, identificamos estas emoções predominantes
          </motion.p>
        </motion.div>

        {/* Emotion Bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-sm font-medium text-foreground">Emoções Detectadas</h3>
          {mockEmotions.map((emotion, index) => (
            <motion.div
              key={emotion.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex justify-between text-sm">
                <span className="text-foreground">{emotion.name}</span>
                <span className="text-muted-foreground">{emotion.percentage}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${emotion.percentage}%` }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  className={`h-full ${emotion.color} rounded-full`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h3 className="text-sm font-medium text-foreground">Recomendações para você</h3>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-card rounded-xl p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl">{rec.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground">{rec.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{rec.description}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{rec.duration}</span>
                  </div>
                </div>
                <Button
                  size="icon"
                  className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90"
                  onClick={() => handleStartRecommendation(rec)}
                >
                  <Play className="w-4 h-4 text-primary-foreground" />
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
