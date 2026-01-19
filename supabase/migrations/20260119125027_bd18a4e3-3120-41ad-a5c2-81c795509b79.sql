-- =====================================================
-- CORREÇÃO PGRST203: Recriar função com novos nomes de parâmetros
-- Precisa fazer DROP primeiro porque PostgreSQL não permite renomear parâmetros
-- A versão (text, uuid) usada por outras apps NÃO será alterada
-- =====================================================

-- 1. Dropar a versão (uuid, text) para poder recriá-la com novos nomes
DROP FUNCTION IF EXISTS public.check_feature_access(uuid, text);

-- 2. Recriar com novos nomes de parâmetros únicos
CREATE FUNCTION public.check_feature_access(
  user_uuid uuid,      -- Nome único para evitar conflito PGRST203
  feature_name text    -- Nome único para evitar conflito PGRST203
)
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_access_level TEXT;
  v_plan_id UUID;
  v_user_type TEXT;
BEGIN
  -- CRÍTICO: Verificar se é sócio primeiro (acesso total imediato)
  SELECT tipo_usuario INTO v_user_type
  FROM usuarios WHERE id = user_uuid;
  
  IF v_user_type = 'socio' THEN
    RETURN 'full';
  END IF;

  -- 1. Verificar override individual (prioridade máxima)
  SELECT access_level INTO v_access_level
  FROM user_feature_overrides
  WHERE user_id = user_uuid
    AND feature_key = feature_name
    AND (expires_at IS NULL OR expires_at > now());
  
  IF v_access_level IS NOT NULL THEN
    RETURN v_access_level;
  END IF;

  -- 2. Buscar plano do usuário via profiles
  SELECT plano_id INTO v_plan_id
  FROM profiles WHERE user_id = user_uuid;

  -- 3. Se não encontrou em profiles, tentar usuarios (como UUID)
  IF v_plan_id IS NULL THEN
    BEGIN
      SELECT plano_id INTO v_plan_id
      FROM usuarios WHERE id = user_uuid AND plano_id IS NOT NULL;
    EXCEPTION WHEN OTHERS THEN
      v_plan_id := NULL;
    END;
  END IF;

  -- 4. Fallback: buscar pelo nome do plano (case-insensitive)
  IF v_plan_id IS NULL THEN
    SELECT p.id INTO v_plan_id
    FROM planos p
    JOIN usuarios u ON LOWER(TRIM(p.nome_plano)) = LOWER(TRIM(u.plano))
    WHERE u.id = user_uuid
    LIMIT 1;
  END IF;

  -- 5. Verificar acesso pelo plano
  IF v_plan_id IS NOT NULL THEN
    SELECT access_level INTO v_access_level
    FROM plan_feature_access
    WHERE plan_id = v_plan_id
      AND feature_key = feature_name;
  END IF;

  -- 6. Retornar acesso ou 'none' como padrão
  RETURN COALESCE(v_access_level, 'none');
END;
$function$;

-- =====================================================
-- Atualizar check_content_access para usar os novos nomes de parâmetros
-- =====================================================

CREATE OR REPLACE FUNCTION public.check_content_access(
  p_user_id uuid, 
  p_content_type text, 
  p_content_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_content_access_level TEXT;
  v_user_feature_access TEXT;
  v_feature_key TEXT;
  v_content_hierarchy JSONB := '{"free": 0, "basic": 1, "premium": 2, "exclusive": 3}'::jsonb;
  v_content_level INT;
  v_max_allowed_level INT;
BEGIN
  -- Determinar a feature_key baseado no tipo de conteúdo
  v_feature_key := p_content_type || '_premium';
  
  -- Buscar nível de acesso do conteúdo
  IF p_content_type = 'breathing' THEN
    SELECT COALESCE(access_level, 'free') INTO v_content_access_level
    FROM breathing_techniques WHERE id = p_content_id;
  ELSIF p_content_type = 'meditation' THEN
    SELECT COALESCE(access_level, 'free') INTO v_content_access_level
    FROM meditation_tracks WHERE id = p_content_id;
  ELSIF p_content_type = 'journey' THEN
    SELECT CASE WHEN is_premium THEN 'premium' ELSE 'free' END INTO v_content_access_level
    FROM journeys WHERE id = p_content_id;
  ELSE
    RETURN true; -- Tipo desconhecido, permitir acesso
  END IF;
  
  -- Se conteúdo não encontrado ou é free, permitir
  IF v_content_access_level IS NULL OR v_content_access_level = 'free' THEN
    RETURN true;
  END IF;
  
  -- Verificar acesso do usuário usando os novos nomes de parâmetros
  v_user_feature_access := public.check_feature_access(
    user_uuid := p_user_id, 
    feature_name := v_feature_key
  );
  
  -- Lógica de acesso cumulativo
  v_content_level := (v_content_hierarchy ->> v_content_access_level)::int;
  
  IF v_user_feature_access = 'full' THEN
    RETURN true; -- Full acessa tudo
  ELSIF v_user_feature_access = 'limited' THEN
    v_max_allowed_level := 1; -- Limited acessa free (0) e basic (1)
    RETURN v_content_level <= v_max_allowed_level;
  ELSE
    RETURN false; -- none ou preview não acessam conteúdo pago
  END IF;
END;
$function$;

-- =====================================================
-- DOCUMENTAÇÃO: Atualizar comentários
-- =====================================================

COMMENT ON FUNCTION check_feature_access(uuid, text) IS 'Versão ETHRA - usa parâmetros user_uuid/feature_name para evitar conflito PGRST203 com versão (text, uuid)';
COMMENT ON FUNCTION check_feature_access(text, uuid) IS 'Versão aplicação externa - usa p_feature_key/p_user_id - NÃO ALTERAR';