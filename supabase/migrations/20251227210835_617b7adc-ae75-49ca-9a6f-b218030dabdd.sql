-- Create isolated table for emotional nutrition context
-- This table stores mindful eating data without modifying existing tables

CREATE TABLE public.emotion_nutrition_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  nutrition_entry_id UUID REFERENCES public.informacoes_nutricionais(id) ON DELETE SET NULL,
  mood_before TEXT NOT NULL,
  hunger_type TEXT NOT NULL DEFAULT 'unknown',
  energy_after TEXT,
  mindful_eating_notes TEXT,
  meal_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT valid_hunger_type CHECK (hunger_type IN ('physical', 'emotional', 'unknown')),
  CONSTRAINT valid_mood CHECK (mood_before IN ('good', 'neutral', 'anxious', 'stressed', 'tired', 'sad', 'happy'))
);

-- Enable RLS
ALTER TABLE public.emotion_nutrition_context ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own emotion nutrition context"
ON public.emotion_nutrition_context
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own emotion nutrition context"
ON public.emotion_nutrition_context
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emotion nutrition context"
ON public.emotion_nutrition_context
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own emotion nutrition context"
ON public.emotion_nutrition_context
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_emotion_nutrition_user_id ON public.emotion_nutrition_context(user_id);
CREATE INDEX idx_emotion_nutrition_created_at ON public.emotion_nutrition_context(created_at DESC);