import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Check, Wind, Moon, BookOpen, Compass, Brain, Heart, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OnboardingSlide, ProgressDots } from '@/components/onboarding/OnboardingSlide';
import { GoalSelector } from '@/components/onboarding/GoalSelector';
import { ExperienceLevelSelector } from '@/components/onboarding/ExperienceLevel';
import { TimePreference } from '@/components/onboarding/TimePreference';
import { MiniBreathingExperience } from '@/components/onboarding/MiniBreathingExperience';
import { useOnboarding, type UserGoal, type ExperienceLevel } from '@/hooks/useOnboarding';

const GOAL_LABELS: Record<UserGoal, string> = {
  reduce_stress: 'Reduzir estresse',
  sleep_better: 'Dormir melhor',
  focus: 'Foco e clareza',
  self_knowledge: 'Autoconhecimento',
  emotional_balance: 'Equilíbrio emocional',
  mindfulness: 'Mindfulness',
};

const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Experiente',
};

interface Recommendation {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const getRecommendations = (goals: UserGoal[]): Recommendation[] => {
  const recs: Recommendation[] = [];
  
  if (goals.includes('reduce_stress')) {
    recs.push({ 
      icon: <Wind className="w-5 h-5" />, 
      title: 'Respiração 4-7-8', 
      description: 'Técnica calmante para alívio imediato',
      color: '#9B87F5'
    });
  }
  if (goals.includes('sleep_better')) {
    recs.push({ 
      icon: <Moon className="w-5 h-5" />, 
      title: 'Meditação Noturna', 
      description: 'Sons e guias para dormir melhor',
      color: '#6366F1'
    });
  }
  if (goals.includes('focus')) {
    recs.push({ 
      icon: <Target className="w-5 h-5" />, 
      title: 'Respiração Energizante', 
      description: 'Aumente seu foco e concentração',
      color: '#FBBF24'
    });
  }
  if (goals.includes('self_knowledge')) {
    recs.push({ 
      icon: <BookOpen className="w-5 h-5" />, 
      title: 'Diário Emocional', 
      description: 'Registre e compreenda suas emoções',
      color: '#EC4899'
    });
  }
  if (goals.includes('emotional_balance')) {
    recs.push({ 
      icon: <Heart className="w-5 h-5" />, 
      title: 'Jornadas Guiadas', 
      description: 'Programas de 7 dias para equilíbrio',
      color: '#F97316'
    });
  }
  if (goals.includes('mindfulness')) {
    recs.push({ 
      icon: <Compass className="w-5 h-5" />, 
      title: 'Guias Espirituais', 
      description: 'Conversas com mentores virtuais',
      color: '#10B981'
    });
  }
  
  // Default recommendations if none match
  if (recs.length === 0) {
    recs.push({ 
      icon: <Wind className="w-5 h-5" />, 
      title: 'Técnicas de Respiração', 
      description: 'Comece com práticas simples',
      color: '#9B87F5'
    });
  }
  
  return recs.slice(0, 3);
};

const getPersonalizedMessage = (goals: UserGoal[], level: ExperienceLevel | null): string => {
  if (goals.includes('reduce_stress') && level === 'beginner') {
    return 'Você está no lugar certo! Vamos começar com práticas simples e poderosas para aliviar o estresse do dia a dia.';
  }
  if (goals.includes('sleep_better')) {
    return 'Noites tranquilas estão a caminho. Temos meditações especiais para ajudar você a relaxar e dormir melhor.';
  }
  if (goals.includes('focus') && level === 'advanced') {
    return 'Ótimo! Vamos aprofundar sua prática com técnicas avançadas para máxima concentração e clareza mental.';
  }
  if (goals.includes('self_knowledge')) {
    return 'A jornada do autoconhecimento começa aqui. O diário emocional e os insights vão te ajudar a se entender melhor.';
  }
  if (level === 'beginner') {
    return 'Bem-vindo(a) ao mundo da meditação! Preparamos práticas gentis para você começar sua jornada.';
  }
  if (level === 'advanced') {
    return 'Que bom ter você aqui! O ETHRA tem recursos avançados para enriquecer sua prática.';
  }
  return 'Sua jornada de bem-estar começa agora. O ETHRA vai te guiar em cada passo com práticas personalizadas.';
};

export default function Onboarding() {
  const navigate = useNavigate();
  const {
    preferences,
    currentStep,
    totalSteps,
    setCurrentStep,
    setGoals,
    setExperienceLevel,
    setPreferredTime,
    completeOnboarding,
  } = useOnboarding();

  const [breathingCompleted, setBreathingCompleted] = useState(false);

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true;
      case 1: return preferences.goals.length > 0;
      case 2: return preferences.experienceLevel !== null;
      case 3: return preferences.preferredTime !== null;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    completeOnboarding();
    navigate('/');
  };

  const handleSkipToAuth = () => {
    completeOnboarding();
    navigate('/landing');
  };

  const recommendations = getRecommendations(preferences.goals);

  const renderSlide = () => {
    switch (currentStep) {
      case 0:
        return (
          <OnboardingSlide>
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              {/* Logo Animation with purple theme */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="relative mb-8"
              >
                <motion.div 
                  className="w-28 h-28 rounded-full flex items-center justify-center shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #9B87F5 0%, #7C3AED 50%, #6D28D9 100%)',
                  }}
                  animate={{
                    boxShadow: [
                      '0 0 30px rgba(155, 135, 245, 0.4)',
                      '0 0 50px rgba(124, 58, 237, 0.5)',
                      '0 0 30px rgba(155, 135, 245, 0.4)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Sparkles className="w-14 h-14 text-white" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #9B87F540 0%, #7C3AED20 100%)' }}
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-bold text-foreground mb-3"
              >
                ETHRA
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl font-medium mb-4"
                style={{ color: '#9B87F5' }}
              >
                Encontre sua paz interior
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-muted-foreground text-base max-w-xs"
              >
                Meditação, respiração e autoconhecimento em um só lugar
              </motion.p>
            </div>
          </OnboardingSlide>
        );

      case 1:
        return (
          <OnboardingSlide>
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #9B87F5 0%, #7C3AED 100%)' }}
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                O que te traz ao ETHRA?
              </h2>
              <p className="text-muted-foreground">
                Nos conte seus objetivos para personalizar sua experiência
              </p>
            </div>
            <GoalSelector
              selected={preferences.goals}
              onChange={setGoals}
            />
          </OnboardingSlide>
        );

      case 2:
        return (
          <OnboardingSlide>
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)' }}
              >
                <Compass className="w-6 h-6 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Qual sua experiência?
              </h2>
              <p className="text-muted-foreground">
                Isso nos ajuda a recomendar práticas ideais para você
              </p>
            </div>
            <ExperienceLevelSelector
              selected={preferences.experienceLevel}
              onChange={setExperienceLevel}
            />
          </OnboardingSlide>
        );

      case 3:
        return (
          <OnboardingSlide>
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)' }}
              >
                <Moon className="w-6 h-6 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Melhor momento para praticar?
              </h2>
              <p className="text-muted-foreground">
                Vamos te lembrar no horário ideal
              </p>
            </div>
            <TimePreference
              selected={preferences.preferredTime}
              onChange={setPreferredTime}
            />
          </OnboardingSlide>
        );

      case 4:
        return (
          <OnboardingSlide>
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #9B87F5 0%, #7C3AED 100%)' }}
              >
                <Wind className="w-6 h-6 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Experimente agora!
              </h2>
              <p className="text-muted-foreground">
                Uma breve sessão de respiração para relaxar
              </p>
            </div>
            <MiniBreathingExperience
              onComplete={() => {
                setBreathingCompleted(true);
                handleNext();
              }}
              onSkip={handleNext}
            />
          </OnboardingSlide>
        );

      case 5:
        return (
          <OnboardingSlide>
            <div className="flex-1 flex flex-col items-center text-center px-4 py-4 overflow-y-auto">
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{
                  background: breathingCompleted 
                    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #9B87F5 0%, #7C3AED 100%)',
                  boxShadow: breathingCompleted 
                    ? '0 0 30px rgba(16, 185, 129, 0.4)'
                    : '0 0 30px rgba(155, 135, 245, 0.4)',
                }}
              >
                {breathingCompleted ? (
                  <Check className="w-10 h-10 text-white" />
                ) : (
                  <Sparkles className="w-10 h-10 text-white" />
                )}
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-foreground mb-2"
              >
                {breathingCompleted ? 'Incrível! 🎉' : 'Tudo pronto!'}
              </motion.h2>

              {/* Personalized message */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground text-sm mb-4 max-w-xs"
              >
                {getPersonalizedMessage(preferences.goals, preferences.experienceLevel)}
              </motion.p>

              {/* Profile summary card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full max-w-xs rounded-2xl p-4 mb-4"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(155, 135, 245, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                  border: '1px solid rgba(155, 135, 245, 0.2)',
                }}
              >
                <h3 className="text-sm font-semibold text-foreground mb-3">Seu Perfil</h3>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {preferences.goals.map((goal) => (
                    <span
                      key={goal}
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ background: 'linear-gradient(135deg, #9B87F5 0%, #7C3AED 100%)' }}
                    >
                      {GOAL_LABELS[goal]}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Nível: {preferences.experienceLevel ? EXPERIENCE_LABELS[preferences.experienceLevel] : '-'}</span>
                </div>
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-xs mb-4"
              >
                <h3 className="text-sm font-semibold text-foreground mb-3 text-left">
                  Recomendamos para você:
                </h3>
                <div className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={rec.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border"
                    >
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: rec.color }}
                      >
                        {rec.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-foreground">{rec.title}</p>
                        <p className="text-xs text-muted-foreground">{rec.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col gap-3 w-full max-w-xs"
              >
                <Button
                  onClick={handleSkipToAuth}
                  size="lg"
                  className="h-14 text-lg font-semibold rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #9B87F5 0%, #7C3AED 100%)',
                  }}
                >
                  Criar conta
                </Button>
                <Button
                  variant="outline"
                  onClick={handleComplete}
                  className="h-12 rounded-xl border-[#9B87F5]/30 hover:bg-[#9B87F5]/10"
                >
                  Explorar primeiro
                </Button>
              </motion.div>
            </div>
          </OnboardingSlide>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Animated purple background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full"
          style={{ 
            background: 'radial-gradient(circle, rgba(155, 135, 245, 0.15) 0%, transparent 70%)' 
          }}
          animate={{ 
            scale: [1, 1.1, 1], 
            opacity: [0.5, 0.8, 0.5] 
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full"
          style={{ 
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%)' 
          }}
          animate={{ 
            scale: [1, 1.15, 1], 
            opacity: [0.4, 0.7, 0.4] 
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
          style={{ 
            background: 'radial-gradient(circle, rgba(109, 40, 217, 0.08) 0%, transparent 60%)' 
          }}
          animate={{ 
            scale: [1, 1.2, 1] 
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 4 }}
        />
      </div>

      {/* Header with progress */}
      <div className="sticky top-0 z-10 px-4 py-4 safe-top bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          {currentStep > 0 && currentStep < 5 ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          ) : (
            <div className="w-10" />
          )}
          
          <ProgressDots total={totalSteps} current={currentStep} />
          
          {currentStep < 4 && currentStep > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                completeOnboarding();
                navigate('/');
              }}
              className="text-muted-foreground text-sm"
            >
              Pular
            </Button>
          ) : (
            <div className="w-10" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-4 pb-safe relative z-10">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentStep} 
            className="flex-1 flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {renderSlide()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        {currentStep < 4 && (
          <motion.div 
            className="py-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              size="lg"
              className="w-full h-14 text-lg font-semibold rounded-2xl gap-2"
              style={{
                background: canProceed() 
                  ? 'linear-gradient(135deg, #9B87F5 0%, #7C3AED 100%)'
                  : undefined,
              }}
            >
              {currentStep === 0 ? 'Começar jornada' : 'Continuar'}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
