import { Link } from 'react-router-dom';
import { useMeditationTracks, useDeleteMeditationTrack } from '@/hooks/useMeditationTracks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, 
  Pencil, 
  Trash2,
  Music,
  Clock,
  Volume2,
  Mic
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { AccessLevelBadge } from '@/components/admin/AccessLevelSelect';

export function MeditationList() {
  const { data: tracks, isLoading } = useMeditationTracks();
  const deleteMutation = useDeleteMeditationTrack();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Music className="h-6 w-6 text-primary" />
            Meditações
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as meditações disponíveis no app
          </p>
        </div>
        <Link to="/admin/meditation/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Meditação
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {tracks?.map((track) => (
          <Card key={track.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Music className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {track.title}
                      <AccessLevelBadge level={track.access_level} />
                      {!track.is_active && (
                        <Badge variant="secondary">Inativo</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {track.duration_display}
                      {track.category && (
                        <>
                          <span>•</span>
                          {track.category.icon} {track.category.name}
                        </>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/admin/meditation/${track.id}`}>
                    <Button variant="outline" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover meditação?</AlertDialogTitle>
                        <AlertDialogDescription>
                          A meditação "{track.title}" será desativada e não aparecerá mais no app.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(track.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {track.description && (
                <p className="text-sm text-muted-foreground mb-3">{track.description}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {track.has_background_music && (
                  <Badge variant="outline" className="gap-1">
                    <Volume2 className="h-3 w-3" />
                    Música de fundo
                  </Badge>
                )}
                {track.has_narration && (
                  <Badge variant="outline" className="gap-1">
                    <Mic className="h-3 w-3" />
                    Narração
                  </Badge>
                )}
                {track.background_audio_url && (
                  <Badge variant="secondary">Áudio carregado</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {tracks?.length === 0 && (
          <Card className="p-8 text-center">
            <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma meditação cadastrada</p>
            <Link to="/admin/meditation/new" className="mt-4 inline-block">
              <Button>Criar primeira meditação</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
