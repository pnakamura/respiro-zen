-- Nova tabela independente para preferências de acessibilidade (App Ethra)
CREATE TABLE public.user_accessibility_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    font_scale TEXT NOT NULL DEFAULT 'normal' 
        CHECK (font_scale IN ('normal', 'large', 'xlarge')),
    high_contrast BOOLEAN NOT NULL DEFAULT false,
    reduce_motion BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Comentário para documentação
COMMENT ON TABLE public.user_accessibility_settings IS 
    'Preferências de acessibilidade do usuário (App Ethra)';

-- RLS habilitado (segurança por usuário)
ALTER TABLE public.user_accessibility_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS isoladas
CREATE POLICY "Users can view own accessibility settings" 
    ON public.user_accessibility_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accessibility settings" 
    ON public.user_accessibility_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accessibility settings" 
    ON public.user_accessibility_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- Trigger usando função existente
CREATE TRIGGER update_accessibility_settings_updated_at
    BEFORE UPDATE ON public.user_accessibility_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_english();