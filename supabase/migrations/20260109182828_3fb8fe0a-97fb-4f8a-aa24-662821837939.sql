-- Atualizar função check_feature_access para buscar plano pelo nome quando plano_id não estiver preenchido
CREATE OR REPLACE FUNCTION public.check_feature_access(p_feature_key text, p_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_type text;
  v_plan_id uuid;
  v_access_level text;
  v_override_level text;
BEGIN
  -- 1. Buscar dados do usuário
  SELECT tipo_usuario, plano_id INTO v_user_type, v_plan_id
  FROM usuarios
  WHERE id = p_user_id;

  -- 2. Se for sócio, acesso total
  IF v_user_type = 'socio' THEN
    RETURN 'full';
  END IF;

  -- 3. Verificar override individual (maior prioridade)
  SELECT access_level INTO v_override_level
  FROM user_feature_overrides
  WHERE user_id = p_user_id 
    AND feature_key = p_feature_key
    AND (expires_at IS NULL OR expires_at > now());
  
  IF v_override_level IS NOT NULL THEN
    RETURN v_override_level;
  END IF;

  -- 4. Se plano_id não preenchido, buscar pelo nome do plano (case-insensitive e trim-safe)
  IF v_plan_id IS NULL THEN
    SELECT p.id INTO v_plan_id
    FROM planos p
    JOIN usuarios u ON LOWER(TRIM(p.nome_plano)) = LOWER(TRIM(u.plano))
    WHERE u.id = p_user_id
    LIMIT 1;
  END IF;

  -- 5. Se ainda não tem plano, retornar 'none'
  IF v_plan_id IS NULL THEN
    RETURN 'none';
  END IF;

  -- 6. Buscar acesso do plano
  SELECT access_level INTO v_access_level
  FROM plan_feature_access
  WHERE plan_id = v_plan_id AND feature_key = p_feature_key;

  -- 7. Retornar nível de acesso ou 'none' se não configurado
  RETURN COALESCE(v_access_level, 'none');
END;
$$;

-- Inserir configuração faltante para module_journal no plano ESSENCIAL
INSERT INTO plan_feature_access (plan_id, feature_key, access_level)
VALUES ('d5890310-c4cb-44ca-9153-86f4c3d604ed', 'module_journal', 'limited')
ON CONFLICT (plan_id, feature_key) DO NOTHING;