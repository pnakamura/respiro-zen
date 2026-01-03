import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  useAdminJourney, 
  useAdminJourneyDay, 
  useAdminJourneyDays,
  useCreateJourneyDay, 
  useUpdateJourneyDay 
} from '@/hooks/useAdminJourneys';
import { useBreathingTechniques } from '@/hooks/useBreathingTechniques';
import { useMeditationTracks } from '@/hooks/useMeditationTracks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

const formSchema = z.object({
  day_number: z.number().min(1),
  title: z.string().min(1, 'Título é obrigatório'),
  teaching_text: z.string().min(1, 'Texto de ensinamento é obrigatório'),
  teaching_author: z.string().optional(),
  reflection_prompt: z.string().optional(),
  challenge_title: z.string().optional(),
  challenge_description: z.string().optional(),
  bonus_tip: z.string().optional(),
  suggested_breathing_id: z.string().optional(),
  suggested_meditation_id: z.string().optional(),
  activity_type: z.enum(['mental', 'physical', 'social', 'creative', 'spiritual']),
  activity_description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const activityTypes = [
  { value: 'mental', label: '🧠 Mental' },
  { value: 'physical', label: '🏃 Físico' },
  { value: 'social', label: '👥 Social' },
  { value: 'creative', label: '🎨 Criativo' },
  { value: 'spiritual', label: '🙏 Espiritual' },
];

export function JourneyDayForm() {
  const { journeyId, dayId } = useParams();
  const navigate = useNavigate();
  const isEditing = dayId && dayId !== 'new';
  
  const { data: journey, isLoading: loadingJourney } = useAdminJourney(journeyId);
  const { data: day, isLoading: loadingDay } = useAdminJourneyDay(isEditing ? dayId : undefined);
  const { data: existingDays } = useAdminJourneyDays(journeyId);
  const { data: breathingTechniques } = useBreathingTechniques();
  const { data: meditationTracks } = useMeditationTracks();
  
  const createMutation = useCreateJourneyDay();
  const updateMutation = useUpdateJourneyDay();

  // Calculate next day number for new days
  const nextDayNumber = existingDays 
    ? Math.max(0, ...existingDays.map(d => d.day_number)) + 1
    : 1;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      day_number: nextDayNumber,
      title: '',
      teaching_text: '',
      teaching_author: '',
      reflection_prompt: '',
      challenge_title: '',
      challenge_description: '',
      bonus_tip: '',
      suggested_breathing_id: '',
      suggested_meditation_id: '',
      activity_type: 'mental',
      activity_description: '',
    },
  });

  useEffect(() => {
    if (day) {
      form.reset({
        day_number: day.day_number,
        title: day.title,
        teaching_text: day.teaching_text,
        teaching_author: day.teaching_author || '',
        reflection_prompt: day.reflection_prompt || '',
        challenge_title: day.challenge_title || '',
        challenge_description: day.challenge_description || '',
        bonus_tip: day.bonus_tip || '',
        suggested_breathing_id: day.suggested_breathing_id || '',
        suggested_meditation_id: day.suggested_meditation_id || '',
        activity_type: day.activity_type,
        activity_description: day.activity_description || '',
      });
    } else if (!isEditing && existingDays) {
      form.setValue('day_number', nextDayNumber);
    }
  }, [day, isEditing, existingDays, nextDayNumber, form]);

  const onSubmit = async (data: FormData) => {
    const payload = {
      journey_id: journeyId!,
      day_number: data.day_number,
      title: data.title,
      teaching_text: data.teaching_text,
      teaching_author: data.teaching_author || null,
      reflection_prompt: data.reflection_prompt || null,
      challenge_title: data.challenge_title || null,
      challenge_description: data.challenge_description || null,
      bonus_tip: data.bonus_tip || null,
      suggested_breathing_id: data.suggested_breathing_id || null,
      suggested_meditation_id: data.suggested_meditation_id || null,
      activity_type: data.activity_type,
      activity_description: data.activity_description || null,
    };

    if (isEditing) {
      await updateMutation.mutateAsync({ id: dayId, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    navigate(`/admin/journeys/${journeyId}/days`);
  };

  const isLoading = loadingJourney || loadingDay;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Jornada não encontrada</p>
      </div>
    );
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/journeys/${journeyId}/days`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEditing ? `Editar Dia ${day?.day_number}` : 'Novo Dia'}
          </h1>
          <p className="text-muted-foreground">
            {journey.title}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Identificação do dia na jornada</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="day_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do Dia</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do Dia</FormLabel>
                    <FormControl>
                      <Input placeholder="O Poder da Presença" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="activity_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Atividade</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activityTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
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
                name="activity_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição da Atividade (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Exercício de respiração..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Teaching */}
          <Card>
            <CardHeader>
              <CardTitle>Ensinamento do Dia</CardTitle>
              <CardDescription>Texto principal que o usuário irá ler</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="teaching_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texto de Ensinamento</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="O momento presente é tudo que você tem..."
                        className="min-h-[200px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teaching_author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Autor/Fonte (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Eckhart Tolle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Challenge */}
          <Card>
            <CardHeader>
              <CardTitle>Desafio do Dia</CardTitle>
              <CardDescription>Atividade prática para o usuário realizar</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="challenge_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do Desafio (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Momento de Pausa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="challenge_description"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Descrição do Desafio (opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Reserve 5 minutos para observar sua respiração..."
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

          {/* Extras */}
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo Extra</CardTitle>
              <CardDescription>Reflexão e dica bônus</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="reflection_prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pergunta de Reflexão (opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="O que você percebeu quando parou por um momento?"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bonus_tip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dica Bônus (opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tente fazer esse exercício logo ao acordar..."
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Suggested Practices */}
          <Card>
            <CardHeader>
              <CardTitle>Práticas Sugeridas</CardTitle>
              <CardDescription>Vincule técnicas de respiração ou meditações ao dia</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="suggested_breathing_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Técnica de Respiração (opcional)</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma técnica..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Nenhuma</SelectItem>
                        {breathingTechniques?.map(tech => (
                          <SelectItem key={tech.id} value={tech.id}>
                            {tech.icon} {tech.label}
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
                name="suggested_meditation_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meditação (opcional)</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma meditação..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Nenhuma</SelectItem>
                        {meditationTracks?.map(track => (
                          <SelectItem key={track.id} value={track.id}>
                            {track.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
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
                  {isEditing ? 'Atualizar Dia' : 'Criar Dia'}
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/admin/journeys/${journeyId}/days`)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
