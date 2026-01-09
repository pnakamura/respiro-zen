-- =============================================
-- Sistema de Controle de Acesso por Assinatura
-- =============================================

-- 1. Criar ENUM para roles da aplicação
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Tabela de Roles de Usuário (separada por segurança)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Tabela de Features disponíveis no sistema
CREATE TABLE IF NOT EXISTS public.feature_access_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key TEXT NOT NULL UNIQUE,
  feature_name TEXT NOT NULL,
  feature_description TEXT,
  category TEXT NOT NULL CHECK (category IN ('module', 'breathing', 'meditation', 'journey', 'other')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.feature_access_levels ENABLE ROW LEVEL SECURITY;

-- 4. Tabela de Acesso por Plano
CREATE TABLE IF NOT EXISTS public.plan_feature_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES planos(id) ON DELETE CASCADE,
  feature_key TEXT REFERENCES feature_access_levels(feature_key) ON DELETE CASCADE,
  access_level TEXT DEFAULT 'full' CHECK (access_level IN ('none', 'preview', 'limited', 'full')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (plan_id, feature_key)
);

ALTER TABLE public.plan_feature_access ENABLE ROW LEVEL SECURITY;

-- 5. Tabela de Exceções Individuais (Overrides)
CREATE TABLE IF NOT EXISTS public.user_feature_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_key TEXT REFERENCES feature_access_levels(feature_key) ON DELETE CASCADE,
  access_level TEXT NOT NULL CHECK (access_level IN ('none', 'preview', 'limited', 'full')),
  granted_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, feature_key)
);

ALTER TABLE public.user_feature_overrides ENABLE ROW LEVEL SECURITY;

-- 6. Adicionar coluna access_level às tabelas existentes (retrocompatível)
ALTER TABLE public.breathing_techniques 
  ADD COLUMN IF NOT EXISTS access_level TEXT DEFAULT 'free' 
  CHECK (access_level IN ('free', 'basic', 'premium', 'exclusive'));

ALTER TABLE public.meditation_tracks 
  ADD COLUMN IF NOT EXISTS access_level TEXT DEFAULT 'free'
  CHECK (access_level IN ('free', 'basic', 'premium', 'exclusive'));

-- 7. Função para verificar role (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 8. Função principal para verificar acesso a features
CREATE OR REPLACE FUNCTION public.check_feature_access(
  p_user_id UUID,
  p_feature_key TEXT
) RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_access_level TEXT;
  v_plan_id UUID;
BEGIN
  -- 1. Verificar override individual (prioridade máxima)
  SELECT access_level INTO v_access_level
  FROM user_feature_overrides
  WHERE user_id = p_user_id
    AND feature_key = p_feature_key
    AND (expires_at IS NULL OR expires_at > now());
  
  IF v_access_level IS NOT NULL THEN
    RETURN v_access_level;
  END IF;

  -- 2. Buscar plano do usuário via profiles
  SELECT plano_id INTO v_plan_id
  FROM profiles WHERE user_id = p_user_id;

  -- 3. Se não encontrou em profiles, tentar usuarios
  IF v_plan_id IS NULL THEN
    SELECT plano_id::uuid INTO v_plan_id
    FROM usuarios WHERE id = p_user_id;
  END IF;

  -- 4. Verificar acesso pelo plano
  IF v_plan_id IS NOT NULL THEN
    SELECT access_level INTO v_access_level
    FROM plan_feature_access
    WHERE plan_id = v_plan_id
      AND feature_key = p_feature_key;
  END IF;

  -- 5. Retornar acesso ou 'none' como padrão
  RETURN COALESCE(v_access_level, 'none');
END;
$$;

-- 9. Função para verificar acesso a conteúdo específico
CREATE OR REPLACE FUNCTION public.check_content_access(
  p_user_id UUID,
  p_content_type TEXT,
  p_content_id UUID
) RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_content_access_level TEXT;
  v_user_feature_access TEXT;
  v_feature_key TEXT;
BEGIN
  -- Determinar feature key baseado no tipo de conteúdo
  v_feature_key := p_content_type || '_premium';

  -- Buscar nível de acesso do conteúdo
  IF p_content_type = 'breathing' THEN
    SELECT access_level INTO v_content_access_level
    FROM breathing_techniques WHERE id = p_content_id;
  ELSIF p_content_type = 'meditation' THEN
    SELECT access_level INTO v_content_access_level
    FROM meditation_tracks WHERE id = p_content_id;
  ELSIF p_content_type = 'journey' THEN
    SELECT CASE WHEN is_premium THEN 'premium' ELSE 'free' END INTO v_content_access_level
    FROM journeys WHERE id = p_content_id;
  END IF;

  -- Conteúdo gratuito sempre acessível
  IF v_content_access_level = 'free' OR v_content_access_level IS NULL THEN
    RETURN true;
  END IF;

  -- Verificar acesso do usuário à feature
  v_user_feature_access := public.check_feature_access(p_user_id, v_feature_key);

  -- Mapear níveis de acesso
  RETURN CASE v_user_feature_access
    WHEN 'full' THEN true
    WHEN 'limited' THEN v_content_access_level IN ('free', 'basic')
    WHEN 'preview' THEN v_content_access_level = 'free'
    ELSE false
  END;
END;
$$;

-- 10. RLS Policies

-- user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR is_socio());

-- feature_access_levels
CREATE POLICY "Anyone authenticated can view active features"
  ON public.feature_access_levels FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Socios can manage features"
  ON public.feature_access_levels FOR ALL
  USING (is_socio());

-- plan_feature_access
CREATE POLICY "Anyone authenticated can view plan features"
  ON public.plan_feature_access FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Socios can manage plan features"
  ON public.plan_feature_access FOR ALL
  USING (is_socio());

-- user_feature_overrides
CREATE POLICY "Users can view own overrides"
  ON public.user_feature_overrides FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Socios can manage all overrides"
  ON public.user_feature_overrides FOR ALL
  USING (is_socio());

-- 11. Inserir Features Padrão do Sistema
INSERT INTO public.feature_access_levels (feature_key, feature_name, feature_description, category) VALUES
  ('module_insights', 'Insights Emocionais', 'Análise de padrões emocionais e tendências', 'module'),
  ('module_nutrition', 'Acompanhamento Nutricional', 'Registro e análise de alimentação', 'module'),
  ('module_journal', 'Diário de Reflexões', 'Escrita terapêutica e reflexiva', 'module'),
  ('module_guide', 'Guia Espiritual', 'Conversas com guias espirituais IA', 'module'),
  ('module_report', 'Relatório Semanal IA', 'Relatório personalizado gerado por IA', 'module'),
  ('breathing_premium', 'Respirações Premium', 'Técnicas avançadas de respiração', 'breathing'),
  ('meditation_premium', 'Meditações Premium', 'Meditações guiadas exclusivas', 'meditation'),
  ('journey_premium', 'Jornadas Premium', 'Jornadas de transformação exclusivas', 'journey')
ON CONFLICT (feature_key) DO NOTHING;

-- 12. Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_plan_feature_access_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_plan_feature_access ON public.plan_feature_access;
CREATE TRIGGER trigger_update_plan_feature_access
  BEFORE UPDATE ON public.plan_feature_access
  FOR EACH ROW
  EXECUTE FUNCTION public.update_plan_feature_access_updated_at();