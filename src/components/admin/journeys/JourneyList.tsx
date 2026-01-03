import { Link } from 'react-router-dom';
import { useAllJourneys, useDeleteJourney } from '@/hooks/useAdminJourneys';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, 
  Pencil, 
  Trash2,
  Compass,
  Calendar,
  Eye,
  EyeOff
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

const difficultyLabels: Record<string, string> = {
  'iniciante': 'Iniciante',
  'intermediário': 'Intermediário',
  'avançado': 'Avançado',
};

const difficultyColors: Record<string, string> = {
  'iniciante': 'bg-green-500/10 text-green-600',
  'intermediário': 'bg-yellow-500/10 text-yellow-600',
  'avançado': 'bg-red-500/10 text-red-600',
};

export function JourneyList() {
  const { data: journeys, isLoading } = useAllJourneys();
  const deleteMutation = useDeleteJourney();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Compass className="h-6 w-6 text-primary" />
            Jornadas Interiores
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as trilhas de desenvolvimento pessoal
          </p>
        </div>
        <Link to="/admin/journeys/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Jornada
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {journeys?.map((journey) => (
          <Card key={journey.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{journey.icon}</span>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {journey.title}
                      {!journey.is_active && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <EyeOff className="h-3 w-3" />
                          Inativo
                        </Badge>
                      )}
                      {journey.is_premium && (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          Premium
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{journey.subtitle || journey.category}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/admin/journeys/${journey.id}`}>
                    <Button variant="outline" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to={`/admin/journeys/${journey.id}/days`}>
                    <Button variant="outline" size="icon">
                      <Calendar className="h-4 w-4" />
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
                        <AlertDialogTitle>Remover jornada?</AlertDialogTitle>
                        <AlertDialogDescription>
                          A jornada "{journey.title}" será desativada e não aparecerá mais no app.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(journey.id)}
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
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{journey.description}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="secondary">
                  {journey.duration_days} dias
                </Badge>
                <Badge className={difficultyColors[journey.difficulty] || 'bg-muted'}>
                  {difficultyLabels[journey.difficulty] || journey.difficulty}
                </Badge>
                {journey.category && (
                  <Badge variant="outline">{journey.category}</Badge>
                )}
                {journey.is_active && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    Ativo
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {journeys?.length === 0 && (
          <Card className="p-8 text-center">
            <Compass className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma jornada cadastrada</p>
            <Link to="/admin/journeys/new" className="mt-4 inline-block">
              <Button>Criar primeira jornada</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
