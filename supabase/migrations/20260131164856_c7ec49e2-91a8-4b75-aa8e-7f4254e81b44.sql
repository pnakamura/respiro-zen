
-- ===========================================
-- MIGRAÇÃO DE SEGURANÇA - ETHRA
-- Compatível com app externo de Nutrição
-- ===========================================

-- 1. Corrigir search_path em funções SECURITY DEFINER
-- (Previne SQL injection via search_path manipulation)

-- 1.1 is_admin - já tem search_path, mas vamos garantir
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = $1 AND role = 'admin'
  );
END;
$$;

-- 1.2 can_manage_dependents
CREATE OR REPLACE FUNCTION public.can_manage_dependents()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_tipo text;
BEGIN
  SELECT tipo_usuario::text INTO user_tipo 
  FROM public.usuarios 
  WHERE id = auth.uid();
  
  RETURN user_tipo IN ('gestor', 'socio');
END;
$$;

-- 1.3 can_manage_user_type
CREATE OR REPLACE FUNCTION public.can_manage_user_type(target_user_type text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_type text;
BEGIN
  SELECT tipo_usuario::text INTO current_user_type 
  FROM public.usuarios 
  WHERE id = auth.uid();
  
  IF current_user_type = 'socio' THEN
    RETURN true;
  END IF;
  
  IF current_user_type = 'gestor' AND target_user_type = 'dependente' THEN
    RETURN true;
  END IF;
  
  IF current_user_type = 'gestor' AND public.is_admin() THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- 1.4 has_higher_or_equal_privilege
CREATE OR REPLACE FUNCTION public.has_higher_or_equal_privilege(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_type text;
  target_user_type text;
BEGIN
  SELECT tipo_usuario::text INTO current_user_type 
  FROM public.usuarios 
  WHERE id = auth.uid();
  
  SELECT tipo_usuario::text INTO target_user_type 
  FROM public.usuarios 
  WHERE id = target_user_id;
  
  IF current_user_type = 'socio' THEN
    RETURN true;
  END IF;
  
  IF current_user_type = 'gestor' AND target_user_type IN ('dependente', 'cliente') THEN
    RETURN true;
  END IF;
  
  IF target_user_id = auth.uid() THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- 1.5 get_current_user_role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_tipo text;
BEGIN
  SELECT tipo_usuario::text INTO user_tipo 
  FROM public.usuarios 
  WHERE id = auth.uid();
  
  RETURN user_tipo;
END;
$$;

-- 1.6 make_user_admin
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles 
  SET role = 'admin' 
  WHERE email = user_email;
END;
$$;

-- 2. Corrigir policy de pagamentos (restringir INSERT)
DROP POLICY IF EXISTS "System can insert payments" ON public.pagamentos;

CREATE POLICY "Service role and admins can insert payments"
ON public.pagamentos
FOR INSERT
WITH CHECK (
  current_setting('role', true) = 'service_role' 
  OR public.is_admin()
);

-- 3. Adicionar RLS em moda_teste (tabela sem policy)
ALTER TABLE public.moda_teste ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage moda_teste"
ON public.moda_teste
FOR ALL
USING (current_setting('role', true) = 'service_role')
WITH CHECK (current_setting('role', true) = 'service_role');

-- Comentário de documentação
COMMENT ON FUNCTION public.check_feature_access(uuid, text) IS 
'[COMPARTILHADA] Usada por ETHRA e app de Nutrição. NÃO ALTERAR ASSINATURA sem verificar compatibilidade.';
