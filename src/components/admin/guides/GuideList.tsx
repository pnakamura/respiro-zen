import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAllGuides, useUpdateGuide, useDeleteGuide } from '@/hooks/useGuides';
import { Skeleton } from '@/components/ui/skeleton';

export function GuideList() {
  const navigate = useNavigate();
  const { data: guides, isLoading } = useAllGuides();
  const updateGuide = useUpdateGuide();
  const deleteGuide = useDeleteGuide();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    updateGuide.mutate({ id, is_active: !currentStatus });
  };

  const handleDelete = (id: string) => {
    deleteGuide.mutate(id);
    setDeleteId(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Guias Espirituais</h1>
          <p className="text-muted-foreground">
            Gerencie os guias disponíveis para os usuários
          </p>
        </div>
        <Button onClick={() => navigate('/admin/guides/new')} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Guia
        </Button>
      </div>

      {/* Guides List */}
      <div className="space-y-3">
        {guides?.map((guide, index) => (
          <motion.div
            key={guide.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card rounded-xl border p-4 flex items-center gap-4"
          >
            {/* Avatar */}
            <div className="text-3xl">{guide.avatar_emoji}</div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{guide.name}</h3>
                <Badge variant={guide.is_active ? 'default' : 'secondary'}>
                  {guide.is_active ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              <p className="text-sm text-primary">{guide.approach}</p>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {guide.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleToggleActive(guide.id, guide.is_active)}
                title={guide.is_active ? 'Desativar' : 'Ativar'}
              >
                {guide.is_active ? (
                  <ToggleRight className="w-5 h-5 text-primary" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/admin/guides/${guide.id}`)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteId(guide.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </motion.div>
        ))}

        {guides?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum guia cadastrado. Clique em "Novo Guia" para começar.
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desativar guia?</AlertDialogTitle>
            <AlertDialogDescription>
              O guia será desativado e não aparecerá mais para os usuários.
              Esta ação pode ser revertida posteriormente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Desativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
