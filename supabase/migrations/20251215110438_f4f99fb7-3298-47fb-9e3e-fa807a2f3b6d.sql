-- Add background audio URL column to breathing_techniques table
ALTER TABLE public.breathing_techniques 
ADD COLUMN IF NOT EXISTS background_audio_url TEXT NULL;