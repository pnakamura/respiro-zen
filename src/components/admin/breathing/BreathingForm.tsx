import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBreathingTechnique, useCreateBreathingTechnique, useUpdateBreathingTechnique } from '@/hooks/useBreathingTechniques';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

const formSchema = z.object({
  emotion_id: z.string().min(1, 'ID é obrigatório').regex(/^[a-z_]+$/, 'Use apenas letras minúsculas e underscore'),
  label: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  explanation: z.string().optional(),
  icon: z.string().min(1, 'Ícone é obrigatório'),
  color_class: z.string().default('text-primary'),
  bg_class: z.string().default('bg-primary/10'),
  inhale_ms: z.number().min(1000).max(15000),
  hold_in_ms: z.number().min(0).max(15000),
  exhale_ms: z.number().min(1000).max(15000),
  hold_out_ms: z.number().min(0).max(15000),
  pattern_name: z.string().min(1, 'Nome do padrão é obrigatório'),
  pattern_description: z.string().optional(),
  cycles: z.number().min(1).max(50),
  is_special_technique: z.boolean().default(false),
  special_config: z.string().optional(),
  display_order: z.number().min(0),
  is_active: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

export function BreathingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = id && id !== 'new';
  
  const { data: technique, isLoading } = useBreathingTechnique(isEditing ? id : undefined);
  const createMutation = useCreateBreathingTechnique();
  const updateMutation = useUpdateBreathingTechnique();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emotion_id: '',
      label: '',
      description: '',
      explanation: '',
      icon: '🌬️',
      color_class: 'text-primary',
      bg_class: 'bg-primary/10',
      inhale_ms: 4000,
      hold_in_ms: 0,
      exhale_ms: 4000,
      hold_out_ms: 0,
      pattern_name: '',
      pattern_description: '',
      cycles: 4,
      is_special_technique: false,
      special_config: '{}',
      display_order: 0,
      is_active: true,
    },
  });

  useEffect(() => {
    if (technique) {
      form.reset({
        emotion_id: technique.emotion_id,
        label: technique.label,
        description: technique.description,
        explanation: technique.explanation || '',
        icon: technique.icon,
        color_class: technique.color_class,
        bg_class: technique.bg_class,
        inhale_ms: technique.inhale_ms,
        hold_in_ms: technique.hold_in_ms,
        exhale_ms: technique.exhale_ms,
        hold_out_ms: technique.hold_out_ms,
        pattern_name: technique.pattern_name,
        pattern_description: technique.pattern_description || '',
        cycles: technique.cycles,
        is_special_technique: technique.is_special_technique,
        special_config: JSON.stringify(technique.special_config, null, 2),
        display_order: technique.display_order,
        is_active: technique.is_active,
      });
    }
  }, [technique, form]);

  const onSubmit = async (data: FormData) => {
    let specialConfig = {};
    try {
      specialConfig = data.special_config ? JSON.parse(data.special_config) : {};
    } catch {
      specialConfig = {};
    }

    const payload = {
      emotion_id: data.emotion_id,
      label: data.label,
      description: data.description,
      explanation: data.explanation || null,
      icon: data.icon,
      color_class: data.color_class,
      bg_class: data.bg_class,
      inhale_ms: data.inhale_ms,
      hold_in_ms: data.hold_in_ms,
      exhale_ms: data.exhale_ms,
      hold_out_ms: data.hold_out_ms,
      pattern_name: data.pattern_name,
      pattern_description: data.pattern_description || null,
      cycles: data.cycles,
      is_special_technique: data.is_special_technique,
      special_config: specialConfig,
      display_order: data.display_order,
      is_active: data.is_active,
      created_by: user?.id || null,
    };

    if (isEditing) {
      await updateMutation.mutateAsync({ id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    navigate('/admin/breathing');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/breathing')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEditing ? 'Editar Técnica' : 'Nova Técnica'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Modifique os parâmetros da técnica' : 'Configure uma nova técnica de respiração'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Dados de identificação da técnica</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="emotion_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID único</FormLabel>
                    <FormControl>
                      <Input placeholder="anxious" {...field} disabled={isEditing} />
                    </FormControl>
                    <FormDescription>Identificador (letras minúsculas e _)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Ansioso" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ícone (emoji)</FormLabel>
                    <FormControl>
                      <Input placeholder="😰" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="display_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordem</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Descrição curta</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Estou me sentindo ansioso..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="explanation"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Explicação científica</FormLabel>
                    <FormControl>
                      <Textarea placeholder="A técnica 4-7-8 ativa o sistema nervoso..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Breathing Pattern */}
          <Card>
            <CardHeader>
              <CardTitle>Padrão de Respiração</CardTitle>
              <CardDescription>Configure os tempos de cada fase (em segundos)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="pattern_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do padrão</FormLabel>
                      <FormControl>
                        <Input placeholder="Respiração 4-7-8" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cycles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciclos: {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          onValueChange={([v]) => field.onChange(v)}
                          min={1}
                          max={30}
                          step={1}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="pattern_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição do padrão</FormLabel>
                    <FormControl>
                      <Input placeholder="Inspire por 4s, segure por 7s..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="inhale_ms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inspirar: {field.value / 1000}s</FormLabel>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          onValueChange={([v]) => field.onChange(v)}
                          min={1000}
                          max={15000}
                          step={500}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hold_in_ms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Segurar (após inspirar): {field.value / 1000}s</FormLabel>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          onValueChange={([v]) => field.onChange(v)}
                          min={0}
                          max={15000}
                          step={500}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="exhale_ms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expirar: {field.value / 1000}s</FormLabel>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          onValueChange={([v]) => field.onChange(v)}
                          min={1000}
                          max={15000}
                          step={500}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hold_out_ms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pausa (após expirar): {field.value / 1000}s</FormLabel>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          onValueChange={([v]) => field.onChange(v)}
                          min={0}
                          max={15000}
                          step={500}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Advanced */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações Avançadas</CardTitle>
              <CardDescription>Opções para técnicas especiais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="!mt-0">Ativo</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_special_technique"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="!mt-0">Técnica especial</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="special_config"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Configuração especial (JSON)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder='{"type": "physiological_sigh", "inhale1_ms": 2000}' 
                        className="font-mono text-sm"
                        rows={4}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Para técnicas como Suspiro Fisiológico ou Wim Hof
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="color_class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classe de cor (texto)</FormLabel>
                      <FormControl>
                        <Input placeholder="text-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bg_class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classe de cor (fundo)</FormLabel>
                      <FormControl>
                        <Input placeholder="bg-primary/10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/breathing')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isEditing ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}