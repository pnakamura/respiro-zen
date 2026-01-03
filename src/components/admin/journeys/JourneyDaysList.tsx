import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAdminJourney, useAdminJourneyDays, useDeleteJourneyDay } from '@/hooks/useAdminJourneys';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, 
  Pencil, 
  Trash2,
  ArrowLeft,
  Calendar,
  BookOpen,
  Target,
  Lightbulb
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

const activityTypeLabels: Record<string, string> = {
  'mental': '🧠 Mental',
  'physical': '🏃 Físico',
  'social': '👥 Social',
  'creative': '🎨 Criativo',
  'spiritual': '🙏 Espiritual',
};

export function JourneyDaysList() {
  const { journeyId } = useParams();
  const navigate = useNavigate();
  const { data: journey, isLoading: loadingJourney } = useAdminJourney(journeyId);
  const { data: days, isLoading: loadingDays } = useAdminJourneyDays(journeyId);
  const deleteMutation = useDeleteJourneyDay();

  const isLoading = loadingJourney || loadingDays;

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

  if (!journey) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Jornada não encontrada</p>
        <Link to="/admin/journeys" className="mt-4 inline-block">
          <Button>Voltar às jornadas</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/journeys')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              Dias: {journey.title}
            </h1>
            <p className="text-muted-foreground mt-1">
              {days?.length || 0} de {journey.duration_days} dias configurados
            </p>
          </div>
        </div>
        <Link to={`/admin/journeys/${journeyId}/days/new`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Dia
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {days?.map((day) => (
          <Card key={day.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {day.day_number}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{day.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      {activityTypeLabels[day.activity_type] || day.activity_type}
                      {day.teaching_author && (
                        <span className="text-xs">• {day.teaching_author}</span>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/admin/journeys/${journeyId}/days/${day.id}`}>
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
                        <AlertDialogTitle>Remover dia?</AlertDialogTitle>
                        <AlertDialogDescription>
                          O dia {day.day_number} será permanentemente removido da jornada.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate({ id: day.id, journeyId: journey.id })}
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
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{day.teaching_text}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  Ensinamento
                </Badge>
                {day.challenge_title && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Desafio
                  </Badge>
                )}
                {day.bonus_tip && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Lightbulb className="h-3 w-3" />
                    Dica Bônus
                  </Badge>
                )}
                {day.suggested_breathing_id && (
                  <Badge variant="outline">Respiração sugerida</Badge>
                )}
                {day.suggested_meditation_id && (
                  <Badge variant="outline">Meditação sugerida</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {days?.length === 0 && (
          <Card className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum dia configurado</p>
            <Link to={`/admin/journeys/${journeyId}/days/new`} className="mt-4 inline-block">
              <Button>Criar primeiro dia</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
