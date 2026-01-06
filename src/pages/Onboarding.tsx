import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OnboardingSlide, ProgressDots } from '@/components/onboarding/OnboardingSlide';
import { GoalSelector } from '@/components/onboarding/GoalSelector';
import { ExperienceLevelSelector } from '@/components/onboarding/ExperienceLevel';
import { TimePreference } from '@/components/onboarding/TimePreference';
import { MiniBreathingExperience } from '@/components/onboarding/MiniBreathingExperience';
import { useOnboarding } from '@/hooks/useOnboarding';

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
      case 0: return true; // Welcome
      case 1: return preferences.goals.length > 0;
      case 2: return preferences.experienceLevel !== null;
      case 3: return preferences.preferredTime !== null;
      case 4: return true; // Breathing experience (can skip)
      case 5: return true; // Final
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
    navigate('/auth');
  };

  const renderSlide = () => {
    switch (currentStep) {
      case 0:
        return (
          <OnboardingSlide>
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              {/* Logo Animation */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="relative mb-8"
              >
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-2xl">
                  <Sparkles className="w-14 h-14 text-primary-foreground" />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/20"
                  animate={{
                    scale: [1, 1.3, 1],
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
                className="text-xl text-primary font-medium mb-4"
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
            <div className="text-center mb-8">
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
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
              >
                <Check className="w-12 h-12 text-green-500" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-foreground mb-3"
              >
                {breathingCompleted ? 'Parabéns!' : 'Tudo pronto!'}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground mb-8 max-w-xs"
              >
                {breathingCompleted
                  ? 'Você completou sua primeira prática. Continue sua jornada!'
                  : 'Sua experiência está personalizada e pronta para começar'}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-3 w-full max-w-xs"
              >
                <Button
                  onClick={handleSkipToAuth}
                  size="lg"
                  className="h-14 text-lg font-semibold rounded-2xl"
                >
                  Criar conta
                </Button>
                <Button
                  variant="outline"
                  onClick={handleComplete}
                  className="h-12 rounded-xl"
                >
                  Continuar sem conta
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Header with progress */}
      <div className="sticky top-0 z-10 px-4 py-4 safe-top">
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
      <div className="flex-1 flex flex-col px-4 pb-safe">
        <AnimatePresence mode="wait">
          <div key={currentStep} className="flex-1 flex flex-col">
            {renderSlide()}
          </div>
        </AnimatePresence>

        {/* Navigation buttons */}
        {currentStep < 4 && (
          <div className="py-6">
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              size="lg"
              className="w-full h-14 text-lg font-semibold rounded-2xl gap-2"
            >
              {currentStep === 0 ? 'Começar jornada' : 'Continuar'}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
