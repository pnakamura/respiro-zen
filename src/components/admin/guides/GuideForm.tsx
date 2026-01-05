import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useGuide, useCreateGuide, useUpdateGuide } from '@/hooks/useGuides';
import { Skeleton } from '@/components/ui/skeleton';

const guideSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  avatar_emoji: z.string().min(1, 'Selecione um emoji'),
  description: z.string().min(10, 'Descrição muito curta'),
  approach: z.string().min(2, 'Informe a abordagem'),
  system_prompt: z.string().min(50, 'O prompt deve ter pelo menos 50 caracteres'),
  personality_traits: z.string(),
  topics: z.string(),
  welcome_message: z.string().optional(),
  suggested_questions: z.string(),
  is_active: z.boolean(),
  display_order: z.number().int().min(0),
});

type GuideFormData = z.infer<typeof guideSchema>;

export function GuideForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';

  const { data: guide, isLoading } = useGuide(isNew ? null : id || null);
  const createGuide = useCreateGuide();
  const updateGuide = useUpdateGuide();

  const form = useForm<GuideFormData>({
    resolver: zodResolver(guideSchema),
    defaultValues: {
      name: '',
      avatar_emoji: '🧘',
      description: '',
      approach: '',
      system_prompt: '',
      personality_traits: '',
      topics: '',
      welcome_message: '',
      suggested_questions: '',
      is_active: true,
      display_order: 0,
    },
  });

  useEffect(() => {
    if (guide) {
      form.reset({
        name: guide.name,
        avatar_emoji: guide.avatar_emoji,
        description: guide.description,
        approach: guide.approach,
        system_prompt: guide.system_prompt,
        personality_traits: Array.isArray(guide.personality_traits) 
          ? guide.personality_traits.join(', ') 
          : '',
        topics: Array.isArray(guide.topics) 
          ? guide.topics.join(', ') 
          : '',
        welcome_message: guide.welcome_message || '',
        suggested_questions: Array.isArray(guide.suggested_questions)
          ? guide.suggested_questions.join('\n')
          : '',
        is_active: guide.is_active,
        display_order: guide.display_order,
      });
    }
  }, [guide, form]);

  const onSubmit = async (data: GuideFormData) => {
    const guideData = {
      name: data.name,
      avatar_emoji: data.avatar_emoji,
      description: data.description,
      approach: data.approach,
      system_prompt: data.system_prompt,
      personality_traits: data.personality_traits.split(',').map(s => s.trim()).filter(Boolean),
      topics: data.topics.split(',').map(s => s.trim()).filter(Boolean),
      welcome_message: data.welcome_message || null,
      suggested_questions: data.suggested_questions.split('\n').map(s => s.trim()).filter(Boolean),
      is_active: data.is_active,
      display_order: data.display_order,
    };

    if (isNew) {
      await createGuide.mutateAsync(guideData);
    } else if (id) {
      await updateGuide.mutateAsync({ id, ...guideData });
    }

    navigate('/admin/guides');
  };

  if (!isNew && isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/guides')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isNew ? 'Novo Guia' : 'Editar Guia'}
          </h1>
          <p className="text-muted-foreground">
            {isNew ? 'Crie um novo guia espiritual' : 'Modifique as configurações do guia'}
          </p>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Info */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Guia</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Mestre Thich" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatar_emoji"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emoji Avatar</FormLabel>
                  <FormControl>
                    <Input placeholder="🧘" {...field} />
                  </FormControl>
                  <FormDescription>Um emoji para representar o guia</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="approach"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abordagem</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Budista, Neurociência, Esotérico" {...field} />
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
                  <FormLabel>Ordem de Exibição</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Uma breve descrição do guia e sua abordagem..."
                    className="min-h-[80px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>Aparece na seleção de guias</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="system_prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt do Sistema</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Instruções detalhadas sobre como o guia deve se comportar..."
                    className="min-h-[200px] font-mono text-sm"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Instruções para a IA. Defina personalidade, conhecimentos e regras de comportamento.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="personality_traits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Traços de Personalidade</FormLabel>
                  <FormControl>
                    <Input placeholder="calmo, sábio, compassivo" {...field} />
                  </FormControl>
                  <FormDescription>Separados por vírgula</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="topics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tópicos</FormLabel>
                  <FormControl>
                    <Input placeholder="meditação, mindfulness, paz interior" {...field} />
                  </FormControl>
                  <FormDescription>Separados por vírgula</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="welcome_message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mensagem de Boas-vindas</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Olá! Sou seu guia..."
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>Primeira mensagem ao iniciar conversa</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="suggested_questions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Perguntas Sugeridas</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Como posso encontrar paz?&#10;O que é meditação?&#10;Como lidar com ansiedade?"
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>Uma pergunta por linha</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <FormLabel>Guia Ativo</FormLabel>
                  <FormDescription>
                    Guias inativos não aparecem para os usuários
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/guides')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createGuide.isPending || updateGuide.isPending}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {createGuide.isPending || updateGuide.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
