import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { primaryEmotions, PrimaryEmotion, getIntensityLabel } from '@/data/plutchik-emotions';

interface SelectedEmotion {
  id: string;
  intensity: number;
}

interface PlutchikWheelProps {
  selectedEmotions: SelectedEmotion[];
  onSelect: (emotionId: string) => void;
  onIntensityChange?: (emotionId: string, intensity: number) => void;
}

export function PlutchikWheel({ 
  selectedEmotions, 
  onSelect,
  onIntensityChange 
}: PlutchikWheelProps) {
  const getSelectedEmotion = (id: string) => 
    selectedEmotions.find(e => e.id === id);

  const isSelected = (id: string) => 
    selectedEmotions.some(e => e.id === id);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Roda circular */}
      <div className="relative aspect-square">
        {/* Centro da roda */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <span className="text-sm text-muted-foreground text-center px-2">
              Como você se sente?
            </span>
          </div>
        </div>

        {/* Emoções em círculo */}
        {primaryEmotions.map((emotion, index) => {
          const angle = (index * 360) / 8 - 90; // Começando do topo
          const radius = 42; // % do container
          const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
          const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
          const selected = isSelected(emotion.id);
          const selectedData = getSelectedEmotion(emotion.id);

          return (
            <motion.button
              key={emotion.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(emotion.id)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
            >
              <div
                className={cn(
                  'relative flex flex-col items-center justify-center w-16 h-16 rounded-full transition-all duration-300',
                  selected 
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' 
                    : 'hover:scale-105'
                )}
                style={{
                  backgroundColor: selected ? emotion.color : emotion.bgColor,
                }}
              >
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center z-10"
                  >
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </motion.div>
                )}
                <span className="text-2xl">{emotion.icon}</span>
              </div>
              <span 
                className={cn(
                  'text-xs font-medium mt-1 block text-center whitespace-nowrap',
                  selected ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {selectedData 
                  ? getIntensityLabel(emotion, selectedData.intensity)
                  : emotion.label
                }
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Legenda das emoções selecionadas */}
      {selectedEmotions.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex flex-wrap gap-2 justify-center"
        >
          {selectedEmotions.map(selected => {
            const emotion = primaryEmotions.find(e => e.id === selected.id);
            if (!emotion) return null;
            
            return (
              <div
                key={selected.id}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                style={{ backgroundColor: emotion.bgColor }}
              >
                <span>{emotion.icon}</span>
                <span className="font-medium">
                  {getIntensityLabel(emotion, selected.intensity)}
                </span>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
