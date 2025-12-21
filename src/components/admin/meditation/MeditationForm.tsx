import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  useMeditationTrack, 
  useMeditationCategories,
  useCreateMeditationTrack, 
  useUpdateMeditationTrack,
  useUploadAudio
} from '@/hooks/useMeditationTracks';
import { sanitizeFileName, validateFileSize } from '@/lib/fileUtils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save, Loader2, Upload, Music, X } from 'lucide-react';
import { HelpTooltip } from '@/components/admin/HelpTooltip';

const formSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  category_id: z.string().optional(),
  duration_display: z.string().min(1, 'Duração é obrigatória').regex(/^\d{1,2}:\d{2}$/, 'Formato: 5:00'),
  has_background_music: z.boolean().default(false),
  has_narration: z.boolean().default(false),
  display_order: z.number().min(0),
  is_active: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

function parseDuration(display: string): number {
  const parts = display.split(':');
  if (parts.length !== 2) return 0;
  const minutes = parseInt(parts[0], 10) || 0;
  const seconds = parseInt(parts[1], 10) || 0;
  return (minutes * 60 + seconds) * 1000;
}

export function MeditationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = id && id !== 'new';
  
  const { data: track, isLoading } = useMeditationTrack(isEditing ? id : undefined);
  const { data: categories } = useMeditationCategories();
  const createMutation = useCreateMeditationTrack();
  const updateMutation = useUpdateMeditationTrack();
  const uploadMutation = useUploadAudio();

  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [narrationFile, setNarrationFile] = useState<File | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [narrationUrl, setNarrationUrl] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category_id: '',
      duration_display: '5:00',
      has_background_music: false,
      has_narration: false,
      display_order: 0,
      is_active: true,
    },
  });

  useEffect(() => {
    if (track) {
      form.reset({
        title: track.title,
        description: track.description || '',
        category_id: track.category_id || '',
        duration_display: track.duration_display,
        has_background_music: track.has_background_music,
        has_narration: track.has_narration,
        display_order: track.display_order,
        is_active: track.is_active,
      });
      setBackgroundUrl(track.background_audio_url);
      setNarrationUrl(track.narration_audio_url);
    }
  }, [track, form]);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setFile: (f: File | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    let bgUrl = backgroundUrl;
    let narrUrl = narrationUrl;

    // Upload background audio if new file selected
    if (backgroundFile) {
      const sizeError = validateFileSize(backgroundFile, 100);
      if (sizeError) {
        toast.error(sizeError);
        return;
      }
      const sanitizedName = sanitizeFileName(backgroundFile.name);
      const path = `background/${Date.now()}-${sanitizedName}`;
      bgUrl = await uploadMutation.mutateAsync({ file: backgroundFile, path });
    }

    // Upload narration audio if new file selected
    if (narrationFile) {
      const sizeError = validateFileSize(narrationFile, 100);
      if (sizeError) {
        toast.error(sizeError);
        return;
      }
      const sanitizedName = sanitizeFileName(narrationFile.name);
      const path = `narration/${Date.now()}-${sanitizedName}`;
      narrUrl = await uploadMutation.mutateAsync({ file: narrationFile, path });
    }

    const payload = {
      title: data.title,
      description: data.description || null,
      category_id: data.category_id || null,
      duration_display: data.duration_display,
      duration_ms: parseDuration(data.duration_display),
      has_background_music: data.has_background_music,
      has_narration: data.has_narration,
      background_audio_url: bgUrl,
      narration_audio_url: narrUrl,
      thumbnail_url: null,
      display_order: data.display_order,
      is_active: data.is_active,
      created_by: user?.id || null,
    };

    if (isEditing) {
      await updateMutation.mutateAsync({ id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    navigate('/admin/meditation');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  const isPending = createMutation.isPending || updateMutation.isPending || uploadMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/meditation')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEditing ? 'Editar Meditação' : 'Nova Meditação'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Modifique os dados da meditação' : 'Configure uma nova meditação'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Dados de identificação da meditação</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Título
                      <HelpTooltip content="Título exibido na lista de meditações. Use nomes descritivos e atraentes (ex: 5 Minutos de Calma, Meditação para Dormir, Sons da Natureza)." />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="5 Minutos de Calma" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Categoria
                      <HelpTooltip content="Categoria para organização das meditações. Facilita a navegação do usuário. Novas categorias podem ser criadas no banco de dados." />
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
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
                name="duration_display"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Duração
                      <HelpTooltip content="Duração formatada como minutos:segundos (ex: 5:00 para 5 minutos, 10:30 para 10 minutos e 30 segundos). A duração em milissegundos é calculada automaticamente." />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="5:00" {...field} />
                    </FormControl>
                    <FormDescription>Formato: minutos:segundos</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="display_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Ordem
                      <HelpTooltip content="Ordem de exibição na lista de meditações. Menor número = aparece primeiro. Use 0, 1, 2... para definir a ordem." />
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
                      Descrição
                      <HelpTooltip content="Descrição breve da meditação exibida para o usuário. Descreva o objetivo, benefícios ou o que o usuário pode esperar." />
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Uma meditação guiada para..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Audio Files */}
          <Card>
            <CardHeader>
              <CardTitle>Arquivos de Áudio</CardTitle>
              <CardDescription>Upload de música de fundo e narração</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="has_background_music"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="!mt-0 flex items-center">
                        Música de fundo
                        <HelpTooltip content="Ative se esta meditação possui música de fundo instrumental ou sons ambiente. A música toca durante toda a sessão." />
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="has_narration"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="!mt-0 flex items-center">
                        Narração
                        <HelpTooltip content="Ative se há voz guiando a meditação. A narração é reproduzida junto ou separadamente da música de fundo." />
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Background Audio */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    Música de fundo
                    <HelpTooltip content="Upload do arquivo de música de fundo. Formatos recomendados: MP3 ou AAC. Tamanho máximo: 50MB. Para melhor qualidade, use 128kbps ou superior." />
                  </label>
                  {backgroundUrl && !backgroundFile ? (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <Music className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate flex-1">Áudio carregado</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setBackgroundUrl(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : backgroundFile ? (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <Music className="h-4 w-4 text-primary" />
                      <span className="text-sm truncate flex-1">{backgroundFile.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setBackgroundFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Clique para selecionar</span>
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => handleFileSelect(e, setBackgroundFile)}
                      />
                    </label>
                  )}
                </div>

                {/* Narration Audio */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    Narração
                    <HelpTooltip content="Upload do arquivo de narração/voz guia. Formatos recomendados: MP3 ou AAC. Grave em ambiente silencioso para melhor qualidade." />
                  </label>
                  {narrationUrl && !narrationFile ? (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <Music className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate flex-1">Áudio carregado</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setNarrationUrl(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : narrationFile ? (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <Music className="h-4 w-4 text-primary" />
                      <span className="text-sm truncate flex-1">{narrationFile.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setNarrationFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Clique para selecionar</span>
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => handleFileSelect(e, setNarrationFile)}
                      />
                    </label>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
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
                      <HelpTooltip content="Desative para ocultar a meditação temporariamente sem excluí-la. Meditações inativas não aparecem para os usuários." />
                    </FormLabel>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/meditation')}>
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
