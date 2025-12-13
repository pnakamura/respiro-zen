import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HelpTooltip } from '@/components/admin/HelpTooltip';

interface ColorOption {
  name: string;
  textClass: string;
  bgClass: string;
  previewColor: string;
}

const colorOptions: ColorOption[] = [
  { name: 'Calma (Teal)', textClass: 'text-calm', bgClass: 'bg-calm/15', previewColor: 'hsl(174 65% 42%)' },
  { name: 'Energia (Coral)', textClass: 'text-energy', bgClass: 'bg-energy/15', previewColor: 'hsl(14 85% 58%)' },
  { name: 'Aterramento (Slate)', textClass: 'text-grounding', bgClass: 'bg-grounding/15', previewColor: 'hsl(199 50% 30%)' },
  { name: 'Pânico (Roxo)', textClass: 'text-panic', bgClass: 'bg-panic/15', previewColor: 'hsl(280 75% 55%)' },
  { name: 'Meditação (Azul)', textClass: 'text-meditate', bgClass: 'bg-meditate/15', previewColor: 'hsl(240 65% 55%)' },
  { name: 'Primário', textClass: 'text-primary', bgClass: 'bg-primary/15', previewColor: 'hsl(174 65% 42%)' },
  { name: 'Verde', textClass: 'text-green-500', bgClass: 'bg-green-500/15', previewColor: 'hsl(142 71% 45%)' },
  { name: 'Azul Claro', textClass: 'text-sky-500', bgClass: 'bg-sky-500/15', previewColor: 'hsl(199 89% 48%)' },
  { name: 'Âmbar', textClass: 'text-amber-500', bgClass: 'bg-amber-500/15', previewColor: 'hsl(38 92% 50%)' },
  { name: 'Rosa', textClass: 'text-pink-500', bgClass: 'bg-pink-500/15', previewColor: 'hsl(330 81% 60%)' },
  { name: 'Índigo', textClass: 'text-indigo-500', bgClass: 'bg-indigo-500/15', previewColor: 'hsl(239 84% 67%)' },
  { name: 'Vermelho', textClass: 'text-red-500', bgClass: 'bg-red-500/15', previewColor: 'hsl(0 84% 60%)' },
];

interface ColorPickerProps {
  textClass: string;
  bgClass: string;
  icon: string;
  label: string;
  onColorChange: (textClass: string, bgClass: string) => void;
}

export function ColorPicker({ textClass, bgClass, icon, label, onColorChange }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  
  const selectedColor = colorOptions.find(c => c.textClass === textClass) || colorOptions[0];
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Cor do Card</span>
        <HelpTooltip content="Escolha a cor que será usada no card de seleção e durante a animação de respiração. A cor deve refletir o estado emocional associado." />
      </div>
      
      {/* Preview Card */}
      <div className="rounded-xl border bg-card p-4">
        <p className="text-xs text-muted-foreground mb-2">Preview do card:</p>
        <motion.div
          layout
          className={cn(
            'relative rounded-2xl p-5 border-2 border-transparent',
            'transition-all duration-300',
            bgClass
          )}
          style={{
            borderColor: selectedColor.previewColor + '40',
          }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              className={cn(
                'flex items-center justify-center w-14 h-14 rounded-xl text-3xl',
                'bg-background/60 backdrop-blur-sm shadow-sm'
              )}
              whileHover={{ scale: 1.05 }}
            >
              {icon || '🌬️'}
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className={cn('font-bold text-lg truncate', textClass)}>
                {label || 'Nome da Técnica'}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                Descrição curta do estado emocional
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Color Selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-12"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-6 h-6 rounded-full border-2 border-border"
                style={{ backgroundColor: selectedColor.previewColor }}
              />
              <span>{selectedColor.name}</span>
            </div>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3" align="start">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground mb-3">Selecione uma cor</p>
            <div className="grid grid-cols-3 gap-2">
              <AnimatePresence>
                {colorOptions.map((color) => (
                  <motion.button
                    key={color.name}
                    type="button"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onColorChange(color.textClass, color.bgClass);
                      setOpen(false);
                    }}
                    className={cn(
                      'relative flex flex-col items-center gap-2 p-3 rounded-xl',
                      'border-2 transition-all duration-200',
                      'hover:shadow-md',
                      textClass === color.textClass 
                        ? 'border-primary bg-primary/5' 
                        : 'border-transparent bg-muted/50 hover:bg-muted'
                    )}
                  >
                    <div 
                      className="w-8 h-8 rounded-full shadow-sm ring-2 ring-background"
                      style={{ backgroundColor: color.previewColor }}
                    />
                    <span className="text-[10px] font-medium text-center leading-tight">
                      {color.name}
                    </span>
                    {textClass === color.textClass && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 right-1"
                      >
                        <Check className="h-3 w-3 text-primary" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Show current classes for power users */}
      <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
        <p><code className="bg-muted px-1 rounded">{textClass}</code></p>
        <p><code className="bg-muted px-1 rounded">{bgClass}</code></p>
      </div>
    </div>
  );
}
