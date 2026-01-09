import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Bold, Italic, List, Sparkles, Save, Mic, Loader2, BookOpen, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { safeGoBack } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { useJournalEntries, useCreateJournalEntry, useDeleteJournalEntry } from '@/hooks/useJournalEntries';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FeatureGate } from '@/components/access/FeatureGate';
import { UpgradeModal } from '@/components/access/UpgradeModal';
import { useCanAccess } from '@/hooks/useFeatureAccess';

export default function Journal() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { accessLevel } = useCanAccess('module_journal');
  const { data: entries, isLoading: loadingEntries } = useJournalEntries();
  const createEntry = useCreateJournalEntry();
  const deleteEntry = useDeleteJournalEntry();
  
  const [text, setText] = useState('');
  const [detectedEmotions, setDetectedEmotions] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  const handleSave = async () => {
    if (!text.trim()) {
      toast.error('Escreva algo antes de salvar');
      return;
    }

    if (!user) {
      toast.error('Faça login para salvar suas entradas');
      return;
    }

    try {
      await createEntry.mutateAsync({
        content: text,
        word_count: wordCount,
        detected_emotions: detectedEmotions,
      });
      setText('');
      setDetectedEmotions([]);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEntry.mutateAsync(id);
    } catch (error) {
      // Error handled by hook
    }
  };

  const detectEmotions = () => {
    // Simple emotion detection simulation based on keywords
    const lowerText = text.toLowerCase();
    const emotions: string[] = [];
    
    if (lowerText.includes('feliz') || lowerText.includes('alegr')) emotions.push('Alegria');
    if (lowerText.includes('trist') || lowerText.includes('choro')) emotions.push('Tristeza');
    if (lowerText.includes('raiva') || lowerText.includes('irritad')) emotions.push('Raiva');
    if (lowerText.includes('medo') || lowerText.includes('ansios')) emotions.push('Medo');
    if (lowerText.includes('calm') || lowerText.includes('paz')) emotions.push('Calma');
    if (lowerText.includes('amor') || lowerText.includes('carinho')) emotions.push('Amor');
    
    if (emotions.length === 0 && text.length > 20) {
      emotions.push('Reflexivo');
    }
    
    setDetectedEmotions(emotions);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (text.length > 10) {
        detectEmotions();
      } else {
        setDetectedEmotions([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [text]);

  const today = new Date();
  const dateString = today.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-[100dvh] flex flex-col pb-28">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 glass"
      >
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => safeGoBack(navigate, '/')}
            className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Diário Emocional</h1>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 -mr-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <BookOpen className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6">
        <AnimatePresence mode="wait">
          {showHistory ? (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Histórico</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(false)}
                  className="text-primary"
                >
                  Nova entrada
                </Button>
              </div>

              {loadingEntries ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : entries && entries.length > 0 ? (
                <div className="space-y-3">
                  {entries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="card-elevated p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(entry.created_at), "EEEE, d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                        </p>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-foreground line-clamp-3">
                        {entry.content}
                      </p>
                      {entry.detected_emotions && entry.detected_emotions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {entry.detected_emotions.map((emotion, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                            >
                              {emotion}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {entry.word_count} palavras
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Nenhuma entrada ainda</p>
                  <Button
                    variant="link"
                    onClick={() => setShowHistory(false)}
                    className="mt-2 text-primary"
                  >
                    Escreva sua primeira entrada
                  </Button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-5"
            >
              {/* Date Card */}
              <div className="card-elevated p-4 text-center">
                <p className="text-sm font-medium text-foreground capitalize">
                  {dateString}
                </p>
              </div>

              {/* Formatting Bar */}
              <div className="flex items-center gap-1 p-2 rounded-xl bg-muted/50">
                <button className="p-2.5 rounded-lg hover:bg-muted transition-colors">
                  <Bold className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-2.5 rounded-lg hover:bg-muted transition-colors">
                  <Italic className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-2.5 rounded-lg hover:bg-muted transition-colors">
                  <List className="w-4 h-4 text-muted-foreground" />
                </button>
                <div className="flex-1" />
                <button className="p-2.5 rounded-lg hover:bg-muted transition-colors">
                  <Mic className="w-4 h-4 text-muted-foreground" />
                </button>
                <span className="text-xs text-muted-foreground px-2 font-medium">
                  {wordCount} {wordCount === 1 ? 'palavra' : 'palavras'}
                </span>
              </div>

              {/* Text Area */}
              <div className="card-elevated p-1">
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Como você está se sentindo hoje? Escreva livremente sobre suas emoções, pensamentos e experiências..."
                  className="min-h-[280px] resize-none border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 rounded-xl p-4 text-base leading-relaxed"
                />
              </div>

              {/* AI Detection Tag */}
              <AnimatePresence>
                {detectedEmotions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="card-elevated p-4 border-l-4 border-l-primary flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">IA detectou</p>
                      <p className="text-sm font-semibold text-foreground">
                        {detectedEmotions.join(', ')}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login reminder */}
              {!user && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center p-4 rounded-xl bg-muted/50"
                >
                  <p className="text-sm text-muted-foreground">
                    Faça login para salvar suas entradas
                  </p>
                  <Button
                    variant="link"
                    onClick={() => navigate('/auth')}
                    className="text-primary mt-1"
                  >
                    Entrar
                  </Button>
                </motion.div>
              )}

              {/* Save Button */}
              <Button
                onClick={handleSave}
                disabled={!text.trim() || createEntry.isPending}
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base shadow-lg shadow-primary/20 btn-glow disabled:opacity-50"
              >
                {createEntry.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Salvar e Analisar
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNavigation />
    </div>
  );
}
