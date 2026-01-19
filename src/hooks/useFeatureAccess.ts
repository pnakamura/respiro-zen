import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type AccessLevel = 'none' | 'preview' | 'limited' | 'full';
export type ContentAccessLevel = 'free' | 'basic' | 'premium' | 'exclusive';

interface FeatureAccess {
  canAccess: boolean;
  accessLevel: AccessLevel;
  isLoading: boolean;
}

interface ContentAccess {
  canAccess: boolean;
  contentLevel: ContentAccessLevel;
  userAccessLevel: AccessLevel;
  isLoading: boolean;
}

interface Feature {
  id: string;
  feature_key: string;
  feature_name: string;
  feature_description: string | null;
  category: string;
  is_active: boolean;
}

// Hook para verificar acesso a uma feature específica
export function useCanAccess(featureKey: string): FeatureAccess {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['feature-access', featureKey, user?.id],
    queryFn: async () => {
      if (!user?.id) return 'none';
      
      const { data, error } = await supabase.rpc('check_feature_access', {
        user_uuid: user.id,
        feature_name: featureKey,
      });
      
      if (error) {
        console.error('Error checking feature access:', error);
        return 'none';
      }
      
      return (data as AccessLevel) || 'none';
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
  });

  const accessLevel = (data as AccessLevel) || 'none';
  
  return {
    canAccess: accessLevel !== 'none',
    accessLevel,
    isLoading,
  };
}

// Hook para verificar acesso a conteúdo específico (breathing, meditation, journey)
export function useContentAccess(
  contentType: 'breathing' | 'meditation' | 'journey',
  contentId: string
): ContentAccess {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['content-access', contentType, contentId, user?.id],
    queryFn: async () => {
      if (!user?.id || !contentId) {
        return { canAccess: true, contentLevel: 'free' as ContentAccessLevel, userAccessLevel: 'none' as AccessLevel };
      }
      
      // Buscar nível de acesso do conteúdo
      let contentLevel: ContentAccessLevel = 'free';
      
      if (contentType === 'breathing') {
        const { data: technique } = await supabase
          .from('breathing_techniques')
          .select('access_level')
          .eq('id', contentId)
          .single();
        contentLevel = (technique?.access_level as ContentAccessLevel) || 'free';
      } else if (contentType === 'meditation') {
        const { data: track } = await supabase
          .from('meditation_tracks')
          .select('access_level')
          .eq('id', contentId)
          .single();
        contentLevel = (track?.access_level as ContentAccessLevel) || 'free';
      } else if (contentType === 'journey') {
        const { data: journey } = await supabase
          .from('journeys')
          .select('is_premium')
          .eq('id', contentId)
          .single();
        contentLevel = journey?.is_premium ? 'premium' : 'free';
      }

      // Conteúdo gratuito sempre acessível
      if (contentLevel === 'free') {
        return { canAccess: true, contentLevel, userAccessLevel: 'full' as AccessLevel };
      }

      // Verificar acesso do usuário à feature premium
      const featureKey = `${contentType}_premium`;
      const { data: accessData } = await supabase.rpc('check_feature_access', {
        user_uuid: user.id,
        feature_name: featureKey,
      });

      const userAccessLevel = (accessData as AccessLevel) || 'none';
      
      // Hierarquia de conteúdo para verificação cumulativa
      const contentHierarchy: Record<ContentAccessLevel, number> = {
        free: 0,
        basic: 1,
        premium: 2,
        exclusive: 3,
      };

      // Lógica de acesso cumulativo:
      // - limited: acessa free + basic (níveis 0 e 1)
      // - full: acessa tudo (free + basic + premium + exclusive)
      let canAccess = false;
      
      if (userAccessLevel === 'full') {
        // Full acessa todos os níveis
        canAccess = true;
      } else if (userAccessLevel === 'limited') {
        // Limited acessa free e basic (hierarquia <= 1)
        canAccess = contentHierarchy[contentLevel] <= 1;
      } else if (userAccessLevel === 'preview') {
        // Preview só visualiza, não acessa
        canAccess = false;
      }
      // none: não acessa nada além de free (já tratado acima)

      return { canAccess, contentLevel, userAccessLevel };
    },
    enabled: !!contentId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    canAccess: data?.canAccess ?? true,
    contentLevel: data?.contentLevel ?? 'free',
    userAccessLevel: data?.userAccessLevel ?? 'none',
    isLoading,
  };
}

// Hook para listar todas as features disponíveis
export function useFeatures() {
  return useQuery({
    queryKey: ['features'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_access_levels')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });
      
      if (error) throw error;
      return data as Feature[];
    },
  });
}

// Hook para listar features do usuário com seus níveis de acesso
export function useUserFeatures() {
  const { user } = useAuth();
  const { data: features } = useFeatures();

  return useQuery({
    queryKey: ['user-features', user?.id],
    queryFn: async () => {
      if (!user?.id || !features) return [];

      const results = await Promise.all(
        features.map(async (feature) => {
          const { data: accessLevel } = await supabase.rpc('check_feature_access', {
            user_uuid: user.id,
            feature_name: feature.feature_key,
          });

          return {
            ...feature,
            accessLevel: (accessLevel as AccessLevel) || 'none',
            canAccess: accessLevel !== 'none',
          };
        })
      );

      return results;
    },
    enabled: !!user?.id && !!features,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para verificar se o conteúdo é premium/bloqueado (sem verificar acesso do usuário)
export function useContentLevel(
  contentType: 'breathing' | 'meditation' | 'journey',
  contentId: string
) {
  return useQuery({
    queryKey: ['content-level', contentType, contentId],
    queryFn: async () => {
      if (!contentId) return 'free';
      
      if (contentType === 'breathing') {
        const { data } = await supabase
          .from('breathing_techniques')
          .select('access_level')
          .eq('id', contentId)
          .single();
        return (data?.access_level as ContentAccessLevel) || 'free';
      } else if (contentType === 'meditation') {
        const { data } = await supabase
          .from('meditation_tracks')
          .select('access_level')
          .eq('id', contentId)
          .single();
        return (data?.access_level as ContentAccessLevel) || 'free';
      } else if (contentType === 'journey') {
        const { data } = await supabase
          .from('journeys')
          .select('is_premium')
          .eq('id', contentId)
          .single();
        return data?.is_premium ? 'premium' : 'free';
      }
      
      return 'free';
    },
    enabled: !!contentId,
  });
}
