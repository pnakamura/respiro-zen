-- Adicionar coluna para imagem do dia (SEGURO: tabela exclusiva do ETHRA)
ALTER TABLE journey_days 
ADD COLUMN IF NOT EXISTS image_url text;

COMMENT ON COLUMN journey_days.image_url IS 
  'URL da imagem ilustrativa do dia da jornada - exclusivo ETHRA';

-- Criar bucket para imagens de jornada
INSERT INTO storage.buckets (id, name, public)
VALUES ('journey-images', 'journey-images', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acesso ao bucket
CREATE POLICY "Anyone can view journey images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'journey-images');

CREATE POLICY "Socios can upload journey images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'journey-images' AND is_socio());

CREATE POLICY "Socios can update journey images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'journey-images' AND is_socio());

CREATE POLICY "Socios can delete journey images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'journey-images' AND is_socio());