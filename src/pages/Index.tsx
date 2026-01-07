import { useEffect, useState } from 'react';
import { HomeScreen } from '@/components/HomeScreen';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind } from 'lucide-react';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization / anonymous auth
    const initApp = async () => {
      // Add small delay for smooth transition
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
    };

    initApp();
  }, []);

  const handleSessionComplete = (technique: string, duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const timeStr = minutes > 0 
      ? `${minutes}min ${seconds}s`
      : `${seconds}s`;

    toast.success(`${technique} concluída!`, {
      description: `Você praticou por ${timeStr}. Continue assim! 🌟`,
      duration: 5000,
    });

    // Here we would save to Supabase if connected
    console.log('Session completed:', { technique, duration });
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-calm to-calm/70 flex items-center justify-center shadow-[0_0_40px_10px_hsl(var(--calm)/0.3)]"
              >
                <Wind className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-3xl font-bold text-foreground"
              >
                ETHRA
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-2 text-muted-foreground"
              >
                Meditação & Bem-Estar
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8 flex gap-1"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-calm"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <HomeScreen onSessionComplete={handleSessionComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Index;
