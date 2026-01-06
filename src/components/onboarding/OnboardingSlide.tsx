import React from 'react';
import { motion } from 'framer-motion';

interface OnboardingSlideProps {
  children: React.ReactNode;
  className?: string;
}

export function OnboardingSlide({ children, className = '' }: OnboardingSlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`w-full flex flex-col items-center ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface ProgressDotsProps {
  total: number;
  current: number;
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: total }).map((_, index) => (
        <motion.div
          key={index}
          className={`h-2 rounded-full transition-all duration-300 ${
            index === current
              ? 'w-8 bg-primary'
              : index < current
              ? 'w-2 bg-primary/60'
              : 'w-2 bg-muted-foreground/30'
          }`}
          initial={false}
          animate={{
            scale: index === current ? 1.1 : 1,
          }}
        />
      ))}
    </div>
  );
}
