-- Fix search_path for the trigger function we created
CREATE OR REPLACE FUNCTION public.update_guide_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;