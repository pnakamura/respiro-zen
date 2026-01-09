import { Link } from 'react-router-dom';
import { useBreathingTechniques, useDeleteBreathingTechnique } from '@/hooks/useBreathingTechniques';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, 
  Pencil, 
  Trash2,
  Wind,
  GripVertical
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

export function BreathingList() {
  const { data: techniques, isLoading } = useBreathingTechniques();
  const deleteMutation = useDeleteBreathingTechnique();

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
            <Wind className="h-6 w-6 text-primary" />
            Técnicas de Respiração
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as técnicas de respiração disponíveis no app
          </p>
        </div>
        <Link to="/admin/breathing/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Técnica
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {techniques?.map((technique) => (
          <Card key={technique.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GripVertical className="h-5 w-5" />
                    <span className="text-2xl">{technique.icon}</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {technique.label}
                      <AccessLevelBadge level={technique.access_level} />
                      {!technique.is_active && (
                        <Badge variant="secondary">Inativo</Badge>
                      )}
                      {technique.is_special_technique && (
                        <Badge variant="outline">Especial</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{technique.pattern_name}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/admin/breathing/${technique.id}`}>
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
                        <AlertDialogTitle>Remover técnica?</AlertDialogTitle>
                        <AlertDialogDescription>
                          A técnica "{technique.label}" será desativada e não aparecerá mais no app.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(technique.id)}
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
              <p className="text-sm text-muted-foreground mb-3">{technique.description}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="secondary">
                  Inspira: {technique.inhale_ms / 1000}s
                </Badge>
                {technique.hold_in_ms > 0 && (
                  <Badge variant="secondary">
                    Segura: {technique.hold_in_ms / 1000}s
                  </Badge>
                )}
                <Badge variant="secondary">
                  Expira: {technique.exhale_ms / 1000}s
                </Badge>
                {technique.hold_out_ms > 0 && (
                  <Badge variant="secondary">
                    Pausa: {technique.hold_out_ms / 1000}s
                  </Badge>
                )}
                <Badge variant="secondary">
                  {technique.cycles} ciclos
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}

        {techniques?.length === 0 && (
          <Card className="p-8 text-center">
            <Wind className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma técnica cadastrada</p>
            <Link to="/admin/breathing/new" className="mt-4 inline-block">
              <Button>Criar primeira técnica</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
