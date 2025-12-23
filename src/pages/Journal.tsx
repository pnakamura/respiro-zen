import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bold, Italic, List, Sparkles, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BottomNavigation } from '@/components/BottomNavigation';
import { toast } from 'sonner';

export default function Journal() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [detectedEmotions, setDetectedEmotions] = useState<string[]>([]);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  const handleSave = () => {
    if (!text.trim()) {
      toast.error('Escreva algo antes de salvar');
      return;
    }
    // TODO: Save to Supabase
    toast.success('Entrada salva com sucesso!');
    setText('');
    setDetectedEmotions([]);
  };

  // Simulated AI detection (would be replaced with actual AI call)
  const detectEmotions = () => {
    if (text.length > 20) {
      setDetectedEmotions(['Reflexivo', 'Calmo']);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background pb-20">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border"
      >
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Diário Emocional</h1>
          <div className="w-9" />
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Date Display */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>

          {/* Formatting Bar */}
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <button className="p-2 rounded hover:bg-muted transition-colors">
              <Bold className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="p-2 rounded hover:bg-muted transition-colors">
              <Italic className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="p-2 rounded hover:bg-muted transition-colors">
              <List className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="flex-1" />
            <span className="text-xs text-muted-foreground">
              {wordCount} {wordCount === 1 ? 'palavra' : 'palavras'}
            </span>
          </div>

          {/* Text Area */}
          <Textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              detectEmotions();
            }}
            placeholder="Como você está se sentindo hoje? Escreva livremente sobre suas emoções, pensamentos e experiências..."
            className="min-h-[300px] resize-none border-0 bg-card/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary rounded-xl p-4 text-base leading-relaxed"
          />

          {/* AI Detection Tag */}
          {detectedEmotions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-panic/10 rounded-xl"
            >
              <Sparkles className="w-4 h-4 text-panic" />
              <span className="text-sm text-panic">
                IA detectou: {detectedEmotions.join(', ')}
              </span>
            </motion.div>
          )}

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base"
          >
            <Save className="w-5 h-5 mr-2" />
            Salvar e Analisar
          </Button>
        </motion.div>
      </main>

      <BottomNavigation />
    </div>
  );
}
