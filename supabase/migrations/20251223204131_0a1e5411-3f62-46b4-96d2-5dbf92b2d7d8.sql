-- Create emotion_entries table for tracking emotion selections
CREATE TABLE public.emotion_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  selected_emotions JSONB NOT NULL DEFAULT '[]'::jsonb,
  detected_dyads JSONB DEFAULT '[]'::jsonb,
  recommended_treatment JSONB DEFAULT NULL,
  free_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create breathing_sessions table for tracking completed breathing exercises
CREATE TABLE public.breathing_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  technique_id UUID REFERENCES public.breathing_techniques(id),
  technique_name TEXT NOT NULL,
  emotion_entry_id UUID REFERENCES public.emotion_entries(id),
  cycles_completed INTEGER NOT NULL DEFAULT 0,
  duration_ms INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create journal_entries table for diary entries
CREATE TABLE public.journal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER NOT NULL DEFAULT 0,
  detected_emotions JSONB DEFAULT '[]'::jsonb,
  emotion_entry_id UUID REFERENCES public.emotion_entries(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.emotion_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breathing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- RLS policies for emotion_entries
CREATE POLICY "Users can view their own emotion entries"
ON public.emotion_entries FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own emotion entries"
ON public.emotion_entries FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emotion entries"
ON public.emotion_entries FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own emotion entries"
ON public.emotion_entries FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for breathing_sessions
CREATE POLICY "Users can view their own breathing sessions"
ON public.breathing_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own breathing sessions"
ON public.breathing_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own breathing sessions"
ON public.breathing_sessions FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for journal_entries
CREATE POLICY "Users can view their own journal entries"
ON public.journal_entries FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journal entries"
ON public.journal_entries FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
ON public.journal_entries FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
ON public.journal_entries FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_emotion_entries_user_id ON public.emotion_entries(user_id);
CREATE INDEX idx_emotion_entries_created_at ON public.emotion_entries(created_at DESC);
CREATE INDEX idx_breathing_sessions_user_id ON public.breathing_sessions(user_id);
CREATE INDEX idx_breathing_sessions_completed_at ON public.breathing_sessions(completed_at DESC);
CREATE INDEX idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX idx_journal_entries_created_at ON public.journal_entries(created_at DESC);

-- Trigger to update updated_at on journal_entries
CREATE TRIGGER update_journal_entries_updated_at
BEFORE UPDATE ON public.journal_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_english();