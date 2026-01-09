-- Corrigir a função update_updated_at_column para verificar se a coluna existe
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar se a coluna updated_at existe
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = TG_TABLE_NAME 
    AND column_name = 'updated_at'
    AND table_schema = 'public'
  ) THEN
    NEW.updated_at = now();
  END IF;
  
  -- Verificar se a coluna atualizado_em existe  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = TG_TABLE_NAME 
    AND column_name = 'atualizado_em'
    AND table_schema = 'public'
  ) THEN
    NEW.atualizado_em = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;