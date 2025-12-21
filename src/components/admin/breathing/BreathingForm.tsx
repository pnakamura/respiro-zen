import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useWatch, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBreathingTechnique, useCreateBreathingTechnique, useUpdateBreathingTechnique, useUploadBreathingAudio } from '@/hooks/useBreathingTechniques';
import { sanitizeFileName, validateFileSize } from '@/lib/fileUtils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save, Loader2, Upload, Music, X, Volume2, VolumeX } from 'lucide-react';
import { HelpTooltip } from '@/components/admin/HelpTooltip';
import { ColorPicker } from '@/components/admin/breathing/ColorPicker';

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
  background_audio_url: z.string().optional().nullable(),
});

type FormData = z.infer<typeof formSchema>;

function ColorPickerField() {
  const { control, setValue } = useFormContext<FormData>();
  const colorClass = useWatch({ control, name: 'color_class' });
  const bgClass = useWatch({ control, name: 'bg_class' });
  const icon = useWatch({ control, name: 'icon' });
  const label = useWatch({ control, name: 'label' });

  return (
    <ColorPicker
      textClass={colorClass}
      bgClass={bgClass}
      icon={icon}
      label={label}
      onColorChange={(textClass, newBgClass) => {
        setValue('color_class', textClass);
        setValue('bg_class', newBgClass);
      }}
    />
  );
}

export function BreathingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = id && id !== 'new';
  
  const { data: technique, isLoading } = useBreathingTechnique(isEditing ? id : undefined);
  const createMutation = useCreateBreathingTechnique();
  const updateMutation = useUpdateBreathingTechnique();
  const uploadAudioMutation = useUploadBreathingAudio();
  
  const [isUploading, setIsUploading] = useState(false);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      background_audio_url: null,
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
        background_audio_url: technique.background_audio_url || null,
      });
      if (technique.background_audio_url) {
        setAudioPreviewUrl(technique.background_audio_url);
      }
    }
  }, [technique, form]);

  const handleAudioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (100MB limit)
    const sizeError = validateFileSize(file, 100);
    if (sizeError) {
      toast.error(sizeError);
      return;
    }

    setIsUploading(true);
    try {
      const techniqueId = id || 'new-' + Date.now();
      const publicUrl = await uploadAudioMutation.mutateAsync({ file, techniqueId });
      form.setValue('background_audio_url', publicUrl);
      setAudioPreviewUrl(publicUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAudio = () => {
    form.setValue('background_audio_url', null);
    setAudioPreviewUrl(null);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleAudioPreview = () => {
    if (!audioRef.current || !audioPreviewUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

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
      background_audio_url: data.background_audio_url || null,
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
                    <FormLabel className="flex items-center">
                      ID único
                      <HelpTooltip content="Identificador único usado internamente. Use letras minúsculas e underscore (ex: anxious, tired_morning). Não pode ser alterado depois de criado." />
                    </FormLabel>
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
                    <FormLabel className="flex items-center">
                      Nome
                      <HelpTooltip content="Nome exibido para o usuário no botão de seleção (ex: Ansioso, Estressado, Cansado). Deve ser curto e claro." />
                    </FormLabel>
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
                    <FormLabel className="flex items-center">
                      Ícone (emoji)
                      <HelpTooltip content="Emoji que representa a emoção. Copie de um site de emojis como emojipedia.org (ex: 😰, 😤, 💚, 🧘)" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="😰" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Color Picker - posicionado de forma proeminente */}
              <div className="sm:col-span-2">
                <ColorPickerField />
              </div>
              
              <FormField
                control={form.control}
                name="display_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Ordem
                      <HelpTooltip content="Ordem de exibição na tela principal. Menor número = aparece primeiro. Use 0, 1, 2... para ordenar." />
                    </FormLabel>
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
                    <FormLabel className="flex items-center">
                      Descrição curta
                      <HelpTooltip content="Texto curto (1-2 frases) que o usuário vê ao selecionar esta opção. Descreva o sentimento ou situação." />
                    </FormLabel>
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
                    <FormLabel className="flex items-center">
                      Explicação científica
                      <HelpTooltip content="Texto educativo sobre a técnica, exibido ao clicar no ícone de informação. Explique os benefícios e base científica da técnica." />
                    </FormLabel>
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
                      <FormLabel className="flex items-center">
                        Nome do padrão
                        <HelpTooltip content="Nome da técnica de respiração (ex: Respiração 4-7-8, Box Breathing, Suspiro Fisiológico). Será exibido durante a prática." />
                      </FormLabel>
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
                      <FormLabel className="flex items-center">
                        Ciclos: {field.value}
                        <HelpTooltip content="Quantas vezes o ciclo completo de respiração será repetido. Para iniciantes, 4-6 ciclos é ideal. Para sessões mais longas, 10-20 ciclos." />
                      </FormLabel>
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
                    <FormLabel className="flex items-center">
                      Descrição do padrão
                      <HelpTooltip content="Breve descrição textual do padrão (ex: Inspire por 4s, segure por 7s, expire por 8s). Ajuda o usuário a entender a técnica rapidamente." />
                    </FormLabel>
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
                      <FormLabel className="flex items-center">
                        Inspirar: {field.value / 1000}s
                        <HelpTooltip content="Tempo de inspiração em milissegundos. 4000ms = 4 segundos. Valores comuns: 3000-5000ms para respiração calma, 2000ms para técnicas energizantes." />
                      </FormLabel>
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
                      <FormLabel className="flex items-center">
                        Segurar (após inspirar): {field.value / 1000}s
                        <HelpTooltip content="Tempo de pausa após inspirar. 0 = sem pausa. Na técnica 4-7-8, são 7 segundos (7000ms). Em Box Breathing, são 4 segundos." />
                      </FormLabel>
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
                      <FormLabel className="flex items-center">
                        Expirar: {field.value / 1000}s
                        <HelpTooltip content="Tempo de expiração em milissegundos. Expirações mais longas ativam o sistema nervoso parassimpático. Na 4-7-8, são 8 segundos." />
                      </FormLabel>
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
                      <FormLabel className="flex items-center">
                        Pausa (após expirar): {field.value / 1000}s
                        <HelpTooltip content="Tempo de pausa após expirar. Usado em Box Breathing (4 segundos). Na maioria das técnicas é 0. Pausas longas aumentam retenção de CO2." />
                      </FormLabel>
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

          {/* Audio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Música de Fundo
              </CardTitle>
              <CardDescription>Adicione uma música ambiente para tocar durante a respiração</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="hidden"
                />
                
                {audioPreviewUrl ? (
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={toggleAudioPreview}
                      className="shrink-0"
                    >
                      {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Música carregada</p>
                      <p className="text-xs text-muted-foreground truncate">{audioPreviewUrl.split('/').pop()}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveAudio}
                      className="shrink-0 text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <audio 
                      ref={audioRef} 
                      src={audioPreviewUrl} 
                      loop
                      onEnded={() => setIsPlaying(false)}
                    />
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full h-24 border-dashed"
                  >
                    {isUploading ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-5 w-5 mr-2" />
                    )}
                    {isUploading ? 'Enviando...' : 'Fazer upload de áudio'}
                  </Button>
                )}
                
                <FormDescription>
                  Formatos suportados: MP3, WAV, OGG. A música tocará em loop durante toda a sessão.
                </FormDescription>
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
                      <FormLabel className="!mt-0 flex items-center">
                        Ativo
                        <HelpTooltip content="Desative para ocultar a técnica temporariamente sem excluí-la. Técnicas inativas não aparecem para os usuários." />
                      </FormLabel>
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
                      <FormLabel className="!mt-0 flex items-center">
                        Técnica especial
                        <HelpTooltip content="Ative para técnicas com comportamento diferenciado como Suspiro Fisiológico (dupla inspiração) ou Wim Hof. Requer configuração JSON abaixo." />
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="special_config"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Configuração especial (JSON)
                      <HelpTooltip content='JSON com configurações extras para técnicas especiais. Exemplo para Suspiro Fisiológico: {"type": "physiological_sigh", "inhale1_ms": 2000, "pause_ms": 1000, "inhale2_ms": 2000, "exhale_ms": 6000}' />
                    </FormLabel>
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
