import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Package, Users, FileText, Sparkles, Shield, Check, X, Info, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type AccessLevel = 'none' | 'preview' | 'limited' | 'full';

interface Feature {
  id: string;
  feature_key: string;
  feature_name: string;
  feature_description: string | null;
  category: string;
  is_active: boolean;
}

interface Plan {
  id: string;
  nome_plano: string;
  valor: number;
  ativo: boolean;
}

interface PlanFeatureAccess {
  id: string;
  plan_id: string;
  feature_key: string;
  access_level: AccessLevel;
}

const accessLevelLabels: Record<AccessLevel, { label: string; color: string; description: string }> = {
  none: { label: 'Bloqueado', color: 'bg-destructive/10 text-destructive', description: 'Usuário não vê esta funcionalidade' },
  preview: { label: 'Prévia', color: 'bg-amber-500/10 text-amber-500', description: 'Usuário vê mas não pode usar (mostra cadeado)' },
  limited: { label: 'Limitado', color: 'bg-blue-500/10 text-blue-500', description: 'Acessa apenas conteúdos gratuitos e básicos' },
  full: { label: 'Completo', color: 'bg-green-500/10 text-green-500', description: 'Acesso total a todos os conteúdos' },
};

const categoryIcons: Record<string, typeof Package> = {
  module: FileText,
  breathing: Shield,
  meditation: Sparkles,
  journey: Package,
  other: FileText,
};

export function AccessManagement() {
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Buscar planos
  const { data: plans, isLoading: loadingPlans } = useQuery({
    queryKey: ['admin-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('planos')
        .select('*')
        .eq('ativo', true)
        .order('valor', { ascending: true });
      if (error) throw error;
      return data as Plan[];
    },
  });

  // Buscar features
  const { data: features, isLoading: loadingFeatures } = useQuery({
    queryKey: ['admin-features'],
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

  // Buscar acessos do plano selecionado
  const { data: planAccess, isLoading: loadingAccess } = useQuery({
    queryKey: ['admin-plan-access', selectedPlan],
    queryFn: async () => {
      if (!selectedPlan) return [];
      const { data, error } = await supabase
        .from('plan_feature_access')
        .select('*')
        .eq('plan_id', selectedPlan);
      if (error) throw error;
      return data as PlanFeatureAccess[];
    },
    enabled: !!selectedPlan,
  });

  // Mutation para atualizar acesso
  const updateAccess = useMutation({
    mutationFn: async ({
      planId,
      featureKey,
      accessLevel,
    }: {
      planId: string;
      featureKey: string;
      accessLevel: AccessLevel;
    }) => {
      const { error } = await supabase
        .from('plan_feature_access')
        .upsert(
          {
            plan_id: planId,
            feature_key: featureKey,
            access_level: accessLevel,
          },
          { onConflict: 'plan_id,feature_key' }
        );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-plan-access', selectedPlan] });
      toast.success('Acesso atualizado com sucesso');
    },
    onError: (error) => {
      console.error('Error updating access:', error);
      toast.error('Erro ao atualizar acesso');
    },
  });

  const getAccessForFeature = (featureKey: string): AccessLevel => {
    const access = planAccess?.find((a) => a.feature_key === featureKey);
    return (access?.access_level as AccessLevel) || 'none';
  };

  const groupedFeatures = features?.reduce((acc, feature) => {
    const category = feature.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(feature);
    return acc;
  }, {} as Record<string, Feature[]>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gestão de Acessos por Plano</h1>
        <p className="text-muted-foreground">
          Configure quais funcionalidades estão disponíveis para cada plano
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Como funciona</AlertTitle>
        <AlertDescription className="mt-2 space-y-2">
          <p>
            Aqui você define <strong>quais tipos de conteúdo</strong> cada plano pode acessar. 
            Para definir se um item específico (meditação, respiração, jornada) é gratuito ou premium, 
            edite diretamente o item na sua página de edição.
          </p>
          <div className="flex flex-wrap gap-3 mt-3">
            <TooltipProvider>
              {Object.entries(accessLevelLabels).map(([level, { label, color, description }]) => (
                <Tooltip key={level}>
                  <TooltipTrigger>
                    <Badge className={`${color} cursor-help`}>{label}</Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="plans" className="gap-2">
            <Package className="w-4 h-4" />
            Por Plano
          </TabsTrigger>
          <TabsTrigger value="features" className="gap-2">
            <FileText className="w-4 h-4" />
            Features
          </TabsTrigger>
        </TabsList>

        {/* Tab: Por Plano */}
        <TabsContent value="plans" className="space-y-6">
          {loadingPlans ? (
            <Skeleton className="h-10 w-64" />
          ) : (
            <Select value={selectedPlan || ''} onValueChange={setSelectedPlan}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Selecione um plano" />
              </SelectTrigger>
              <SelectContent>
                {plans?.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.nome_plano} - R$ {plan.valor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {selectedPlan && (
            <div className="space-y-6">
              {loadingFeatures || loadingAccess ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : (
                Object.entries(groupedFeatures || {}).map(([category, categoryFeatures]) => {
                  const Icon = categoryIcons[category] || FileText;
                  const categoryLabels: Record<string, string> = {
                    module: 'Módulos',
                    breathing: 'Respirações',
                    meditation: 'Meditações',
                    journey: 'Jornadas',
                    other: 'Outros',
                  };

                  return (
                    <Card key={category}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Icon className="w-4 h-4 text-primary" />
                          {categoryLabels[category] || category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {categoryFeatures.map((feature) => {
                          const currentAccess = getAccessForFeature(feature.feature_key);
                          const { label, color } = accessLevelLabels[currentAccess];

                          return (
                            <div
                              key={feature.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-sm">{feature.feature_name}</p>
                                {feature.feature_description && (
                                  <p className="text-xs text-muted-foreground">
                                    {feature.feature_description}
                                  </p>
                                )}
                              </div>
                              <Select
                                value={currentAccess}
                                onValueChange={(value) =>
                                  updateAccess.mutate({
                                    planId: selectedPlan,
                                    featureKey: feature.feature_key,
                                    accessLevel: value as AccessLevel,
                                  })
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <Badge className={color}>{label}</Badge>
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(accessLevelLabels).map(([level, { label }]) => (
                                    <SelectItem key={level} value={level}>
                                      {label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </TabsContent>

        {/* Tab: Features */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Features Disponíveis</CardTitle>
              <CardDescription>
                Lista de todas as funcionalidades configuráveis no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingFeatures ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {features?.map((feature) => {
                    const Icon = categoryIcons[feature.category] || FileText;
                    return (
                      <div
                        key={feature.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{feature.feature_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {feature.feature_key}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {feature.category}
                        </Badge>
                        <div className="w-5 h-5 flex items-center justify-center">
                          {feature.is_active ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <X className="w-4 h-4 text-destructive" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
