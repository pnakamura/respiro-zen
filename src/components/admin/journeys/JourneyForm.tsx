import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminJourney, useCreateJourney, useUpdateJourney } from '@/hooks/useAdminJourneys';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save, Loader2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const formSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  subtitle: z.string().optional(),
  description: z.string().min(1, 'Descrição é obrigatória'),
  icon: z.string().min(1, 'Ícone é obrigatório'),
  theme_color: z.string().default('primary'),
  cover_image_url: z.string().optional(),
  duration_days: z.number().min(1).max(365),
  difficulty: z.enum(['iniciante', 'intermediário', 'avançado']),
  category: z.string().default('geral'),
  benefits: z.string().optional(),
  is_premium: z.boolean().default(false),
  is_active: z.boolean().default(true),
  display_order: z.number().min(0),
});

type FormData = z.infer<typeof formSchema>;

const themeColors = [
  { value: 'primary', label: 'Primária (Roxo)' },
  { value: 'amber', label: 'Âmbar' },
  { value: 'emerald', label: 'Esmeralda' },
  { value: 'blue', label: 'Azul' },
  { value: 'rose', label: 'Rosa' },
  { value: 'violet', label: 'Violeta' },
  { value: 'indigo', label: 'Índigo' },
];

const categories = [
  { value: 'geral', label: 'Geral' },
  { value: 'autocuidado', label: 'Autocuidado' },
  { value: 'estoicismo', label: 'Estoicismo' },
  { value: 'mindfulness', label: 'Mindfulness' },
  { value: 'energia', label: 'Energia' },
  { value: 'gratidão', label: 'Gratidão' },
  { value: 'produtividade', label: 'Produtividade' },
  { value: 'autocuidado', label: 'Autocuidado' },
  { value: 'sono', label: 'Sono' },
  { value: 'respiração', label: 'Respiração' },
];

export function JourneyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== 'new';
  
  const { data: journey, isLoading } = useAdminJourney(isEditing ? id : undefined);
  const createMutation = useCreateJourney();
  const updateMutation = useUpdateJourney();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      description: '',
      icon: '🧭',
      theme_color: 'primary',
      cover_image_url: '',
      duration_days: 7,
      difficulty: 'iniciante',
      category: 'geral',
      benefits: '',
      is_premium: false,
      is_active: true,
      display_order: 0,
    },
  });

  useEffect(() => {
    if (journey) {
      form.reset({
        title: journey.title,
        subtitle: journey.subtitle || '',
        description: journey.description,
        icon: journey.icon,
        theme_color: journey.theme_color,
        cover_image_url: journey.cover_image_url || '',
        duration_days: journey.duration_days,
        difficulty: journey.difficulty,
        category: journey.category,
        benefits: journey.benefits?.join('\n') || '',
        is_premium: journey.is_premium,
        is_active: journey.is_active,
        display_order: journey.display_order,
      });
    }
  }, [journey, form]);

  const onSubmit = async (data: FormData) => {
    const benefits = data.benefits
      ? data.benefits.split('\n').filter(b => b.trim())
      : [];

    const payload = {
      title: data.title,
      subtitle: data.subtitle || null,
      description: data.description,
      icon: data.icon,
      theme_color: data.theme_color,
      cover_image_url: data.cover_image_url || null,
      duration_days: data.duration_days,
      difficulty: data.difficulty,
      category: data.category,
      benefits,
      is_premium: data.is_premium,
      is_active: data.is_active,
      display_order: data.display_order,
    };

    if (isEditing) {
      await updateMutation.mutateAsync({ id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    navigate('/admin/journeys');
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/journeys')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isEditing ? 'Editar Jornada' : 'Nova Jornada'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Modifique os dados da jornada' : 'Configure uma nova trilha de desenvolvimento'}
            </p>
          </div>
        </div>
        {isEditing && (
          <Link to={`/admin/journeys/${id}/days`}>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Gerenciar Dias
            </Button>
          </Link>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Dados de identificação da jornada</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Desafio 21 Dias" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtítulo (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Transforme seus hábitos" {...field} />
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
                      <Input placeholder="🧭" {...field} />
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
                    <FormLabel>Ordem de exibição</FormLabel>
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
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Uma jornada transformadora de 21 dias..." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Configuração</CardTitle>
              <CardDescription>Duração, dificuldade e categorização</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="duration_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração (dias)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 7)}
                      />
                    </FormControl>
                    <FormDescription>Número de dias da jornada</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dificuldade</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="iniciante">Iniciante</SelectItem>
                        <SelectItem value="intermediário">Intermediário</SelectItem>
                        <SelectItem value="avançado">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="theme_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor do tema</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {themeColors.map(color => (
                          <SelectItem key={color.value} value={color.value}>
                            {color.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cover_image_url"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>URL da imagem de capa (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Benefícios</CardTitle>
              <CardDescription>Liste os benefícios da jornada (um por linha)</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="benefits"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        placeholder="Redução do estresse&#10;Melhora do sono&#10;Mais clareza mental"
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>Digite um benefício por linha</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
              <CardDescription>Status e opções de visibilidade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Ativo</FormLabel>
                      <FormDescription>
                        Jornada visível para os usuários
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_premium"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Premium</FormLabel>
                      <FormDescription>
                        Disponível apenas para assinantes
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Atualizar Jornada' : 'Criar Jornada'}
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/journeys')}>
              Cancelar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
