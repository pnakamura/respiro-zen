-- =====================================================
-- CORREÇÃO SEGURA: Atualizar check_feature_access(uuid, text)
-- Esta versão é usada pelo ETHRA
-- NÃO remove a versão (text, uuid) usada por outras aplicações
-- =====================================================

-- Atualizar a função para verificar sócio PRIMEIRO
CREATE OR REPLACE FUNCTION public.check_feature_access(p_user_id uuid, p_feature_key text)
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
  FROM usuarios WHERE id = p_user_id;
  
  IF v_user_type = 'socio' THEN
    RETURN 'full';
  END IF;

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

  -- 3. Se não encontrou em profiles, tentar usuarios (como UUID)
  IF v_plan_id IS NULL THEN
    BEGIN
      SELECT plano_id INTO v_plan_id
      FROM usuarios WHERE id = p_user_id AND plano_id IS NOT NULL;
    EXCEPTION WHEN OTHERS THEN
      v_plan_id := NULL;
    END;
  END IF;

  -- 4. Fallback: buscar pelo nome do plano (case-insensitive)
  IF v_plan_id IS NULL THEN
    SELECT p.id INTO v_plan_id
    FROM planos p
    JOIN usuarios u ON LOWER(TRIM(p.nome_plano)) = LOWER(TRIM(u.plano))
    WHERE u.id = p_user_id
    LIMIT 1;
  END IF;

  -- 5. Verificar acesso pelo plano
  IF v_plan_id IS NOT NULL THEN
    SELECT access_level INTO v_access_level
    FROM plan_feature_access
    WHERE plan_id = v_plan_id
      AND feature_key = p_feature_key;
  END IF;

  -- 6. Retornar acesso ou 'none' como padrão
  RETURN COALESCE(v_access_level, 'none');
END;
$function$;

-- =====================================================
-- SEGURANÇA: Adicionar RLS à tabela assinatura_temporaria
-- Protege dados sensíveis (emails, telefones, checkout links)
-- Mantém compatibilidade com webhooks do Mercado Pago
-- =====================================================

-- Habilitar RLS
ALTER TABLE assinatura_temporaria ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pelo próprio email ou sócios/admins
CREATE POLICY "assinatura_read_own_or_admin" ON assinatura_temporaria
  FOR SELECT USING (
    email = auth.email() 
    OR public.is_socio()
  );

-- Permitir inserção por service role (webhooks) ou sócios
CREATE POLICY "assinatura_insert_service" ON assinatura_temporaria
  FOR INSERT WITH CHECK (
    public.is_socio() OR current_setting('role', true) = 'service_role'
  );

-- Permitir atualização por service role (webhooks) ou sócios
CREATE POLICY "assinatura_update_service" ON assinatura_temporaria
  FOR UPDATE USING (
    public.is_socio() OR current_setting('role', true) = 'service_role'
  );

-- =====================================================
-- DOCUMENTAÇÃO: Comentários para banco compartilhado
-- =====================================================

COMMENT ON SCHEMA public IS 'Schema compartilhado entre ETHRA (bem-estar) e aplicação de Nutrição. Não remover funções ou tabelas sem verificar ambas as aplicações.';

COMMENT ON FUNCTION check_feature_access(text, uuid) IS 'Versão usada por aplicação externa - NÃO REMOVER sem verificar dependências';
COMMENT ON FUNCTION check_feature_access(uuid, text) IS 'Versão usada pelo ETHRA - atualizada para verificar tipo_usuario socio';