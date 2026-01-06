import { motion } from 'framer-motion';
import { EmotionRadarData } from '@/hooks/useInsightsData';

interface EmotionRadarChartProps {
  data: EmotionRadarData[];
}

export function EmotionRadarChart({ data }: EmotionRadarChartProps) {
  const centerX = 150;
  const centerY = 150;
  const maxRadius = 100;
  const levels = 5;

  // Calculate points for each emotion on the radar
  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
    const radius = (value / 5) * maxRadius;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  // Create polygon points for the data
  const polygonPoints = data
    .map((d, i) => {
      const point = getPoint(i, d.value);
      return `${point.x},${point.y}`;
    })
    .join(' ');

  // Create label positions
  const getLabelPosition = (index: number) => {
    const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
    const radius = maxRadius + 30;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  const hasData = data.some(d => d.value > 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15 }}
      className="card-elevated p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🎯</span>
        <span className="text-sm font-semibold text-foreground">Perfil Emocional</span>
      </div>

      <div className="flex justify-center">
        <svg width="300" height="300" className="overflow-visible">
          {/* Background circles */}
          {[...Array(levels)].map((_, i) => (
            <circle
              key={i}
              cx={centerX}
              cy={centerY}
              r={(maxRadius / levels) * (i + 1)}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity={0.5}
            />
          ))}

          {/* Axis lines */}
          {data.map((d, i) => {
            const point = getPoint(i, 5);
            return (
              <line
                key={d.emotion}
                x1={centerX}
                y1={centerY}
                x2={point.x}
                y2={point.y}
                stroke="hsl(var(--border))"
                strokeWidth="1"
                opacity={0.3}
              />
            );
          })}

          {/* Data polygon */}
          {hasData && (
            <motion.polygon
              points={polygonPoints}
              fill="hsl(var(--primary) / 0.2)"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{ transformOrigin: `${centerX}px ${centerY}px` }}
            />
          )}

          {/* Data points */}
          {data.map((d, i) => {
            const point = getPoint(i, d.value);
            return (
              <motion.circle
                key={d.emotion}
                cx={point.x}
                cy={point.y}
                r={d.value > 0 ? 6 : 4}
                fill={d.value > 0 ? d.color : 'hsl(var(--muted))'}
                stroke="hsl(var(--background))"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05, type: 'spring' }}
              />
            );
          })}

          {/* Labels */}
          {data.map((d, i) => {
            const pos = getLabelPosition(i);
            const textAnchor = pos.x < centerX - 10 ? 'end' : pos.x > centerX + 10 ? 'start' : 'middle';
            return (
              <g key={`label-${d.emotion}`}>
                <text
                  x={pos.x}
                  y={pos.y - 8}
                  textAnchor={textAnchor}
                  className="text-lg"
                  dominantBaseline="middle"
                >
                  {d.icon}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 10}
                  textAnchor={textAnchor}
                  className="fill-muted-foreground text-[10px] font-medium"
                  dominantBaseline="middle"
                >
                  {d.label}
                </text>
              </g>
            );
          })}

          {/* Center dot */}
          <circle
            cx={centerX}
            cy={centerY}
            r={3}
            fill="hsl(var(--muted-foreground))"
          />
        </svg>
      </div>

      {!hasData && (
        <p className="text-center text-sm text-muted-foreground mt-2">
          Registre emoções para ver seu perfil
        </p>
      )}
    </motion.div>
  );
}
