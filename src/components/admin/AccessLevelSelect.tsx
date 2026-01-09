import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpTooltip } from '@/components/admin/HelpTooltip';
import { Control } from 'react-hook-form';

type AccessLevel = 'free' | 'basic' | 'premium' | 'exclusive';

interface AccessLevelOption {
  value: AccessLevel;
  label: string;
  description: string;
  color: string;
}

const accessLevelOptions: AccessLevelOption[] = [
  { value: 'free', label: 'Gratuito', description: 'Todos os usuários', color: 'bg-green-500' },
  { value: 'basic', label: 'Básico', description: 'Plano ESSENCIAL+', color: 'bg-blue-500' },
  { value: 'premium', label: 'Premium', description: 'Plano PREMIUM+', color: 'bg-amber-500' },
  { value: 'exclusive', label: 'Exclusivo', description: 'Plano PROFISSIONAL', color: 'bg-purple-500' },
];

interface AccessLevelSelectProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name?: string;
  className?: string;
}

export function AccessLevelSelect({ control, name = 'access_level', className }: AccessLevelSelectProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="flex items-center">
            Nível de Acesso
            <HelpTooltip content="Define quem pode acessar este conteúdo. Gratuito: todos os usuários. Básico: plano ESSENCIAL ou superior. Premium: plano PREMIUM ou superior. Exclusivo: apenas plano PROFISSIONAL." />
          </FormLabel>
          <Select onValueChange={field.onChange} value={field.value || 'free'}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {accessLevelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${option.color}`} />
                    <span>{option.label}</span>
                    <span className="text-muted-foreground text-xs">- {option.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>Determina quais planos têm acesso a este conteúdo</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Badge component for lists
interface AccessLevelBadgeProps {
  level: string | null | undefined;
  className?: string;
}

const levelStyles: Record<string, { label: string; className: string }> = {
  free: { label: 'Gratuito', className: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  basic: { label: 'Básico', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  premium: { label: 'Premium', className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  exclusive: { label: 'Exclusivo', className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
};

export function AccessLevelBadge({ level, className = '' }: AccessLevelBadgeProps) {
  const style = levelStyles[level || 'free'] || levelStyles.free;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${style.className} ${className}`}>
      {style.label}
    </span>
  );
}
