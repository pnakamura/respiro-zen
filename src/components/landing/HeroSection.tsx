import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-5 overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-64 h-64 rounded-full bg-landing-lavender/40 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-landing-sage/30 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.3, 0.4] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-landing-serene/20 blur-2xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-landing-lavender/50 text-landing-text/80 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>Seu refúgio de paz interior</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-landing-text leading-tight mb-6"
          >
            Transforme sua{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-landing-sage to-landing-serene">
              ansiedade
            </span>{' '}
            em serenidade
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-landing-text/70 mb-8 max-w-lg mx-auto lg:mx-0"
          >
            Jornadas guiadas de meditação e respiração para quem busca equilíbrio real em um mundo caótico.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Button
              onClick={() => navigate('/auth?trial=true')}
              size="lg"
              className="bg-gradient-to-r from-landing-sage to-landing-serene text-white font-semibold px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Experimente 7 Dias Grátis
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-landing-sage/50 text-landing-text font-medium px-6 py-6 rounded-full hover:bg-landing-lavender/30"
            >
              <Play className="w-5 h-5 mr-2" />
              Ver como funciona
            </Button>
          </motion.div>
        </motion.div>

        {/* App Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative flex justify-center"
        >
          <div className="relative">
            {/* Phone mockup */}
            <motion.div
              className="relative w-64 md:w-72 h-[520px] md:h-[580px] rounded-[3rem] bg-gradient-to-br from-landing-lavender to-landing-serene/30 p-2 shadow-2xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="w-full h-full rounded-[2.5rem] bg-landing-bg overflow-hidden flex flex-col">
                {/* App header */}
                <div className="p-4 bg-gradient-to-r from-landing-sage/20 to-landing-serene/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-landing-sage to-landing-serene flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-landing-text">ETHRA</span>
                  </div>
                </div>
                
                {/* Content preview */}
                <div className="flex-1 p-4 space-y-4">
                  <div className="text-center py-4">
                    <p className="text-sm text-landing-text/60 mb-2">Sua Jornada</p>
                    <h3 className="text-lg font-bold text-landing-text">Controle da Ansiedade</h3>
                    <p className="text-xs text-landing-text/50 mt-1">Dia 3 de 21</p>
                  </div>
                  
                  {/* Progress circle */}
                  <div className="flex justify-center">
                    <motion.div
                      className="w-32 h-32 rounded-full bg-gradient-to-br from-landing-sage/20 to-landing-serene/20 flex items-center justify-center"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-landing-sage to-landing-serene flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">14%</span>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Practice cards */}
                  <div className="space-y-2 mt-4">
                    {['Respiração 4-7-8', 'Meditação Guiada', 'Reflexão do Dia'].map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="p-3 rounded-xl bg-landing-lavender/30 flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-landing-sage/30" />
                        <span className="text-sm font-medium text-landing-text">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating elements */}
            <motion.div
              className="absolute -right-8 top-20 px-4 py-2 rounded-xl bg-white shadow-lg"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              <p className="text-sm font-medium text-landing-text">🧘 4.9 ★</p>
            </motion.div>
            <motion.div
              className="absolute -left-8 bottom-32 px-4 py-2 rounded-xl bg-white shadow-lg"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
            >
              <p className="text-sm font-medium text-landing-text">✨ +5.000 usuários</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
