import { useRef, useEffect, useMemo } from 'react';
import { AnimationEquation, generateCurvePoints } from '@/lib/math-animations';
import { cn } from '@/lib/utils';

interface WaveVisualizerProps {
  equation: AnimationEquation;
  params: Record<string, number>;
  currentTime?: number;
  isPlaying?: boolean;
  showGrid?: boolean;
  showDerivative?: boolean;
  colorScheme?: 'calm' | 'energy' | 'focus' | 'custom';
  customColors?: {
    primary: string;
    secondary: string;
    grid: string;
    marker: string;
  };
  className?: string;
  height?: number;
  resolution?: number;
}

const colorSchemes = {
  calm: {
    primary: '#4ECDC4',
    secondary: 'rgba(78, 205, 196, 0.2)',
    grid: 'rgba(255, 255, 255, 0.1)',
    marker: '#FF6B6B',
    gradient: ['#4ECDC4', '#45B7D1', '#96CEB4'],
  },
  energy: {
    primary: '#FF6B6B',
    secondary: 'rgba(255, 107, 107, 0.2)',
    grid: 'rgba(255, 255, 255, 0.1)',
    marker: '#4ECDC4',
    gradient: ['#FF6B6B', '#FFA07A', '#FFE66D'],
  },
  focus: {
    primary: '#A78BFA',
    secondary: 'rgba(167, 139, 250, 0.2)',
    grid: 'rgba(255, 255, 255, 0.1)',
    marker: '#34D399',
    gradient: ['#A78BFA', '#818CF8', '#6366F1'],
  },
  custom: {
    primary: '#4ECDC4',
    secondary: 'rgba(78, 205, 196, 0.2)',
    grid: 'rgba(255, 255, 255, 0.1)',
    marker: '#FF6B6B',
    gradient: ['#4ECDC4', '#45B7D1', '#96CEB4'],
  },
};

export function WaveVisualizer({
  equation,
  params,
  currentTime = 0,
  isPlaying = false,
  showGrid = true,
  showDerivative = false,
  colorScheme = 'calm',
  customColors,
  className,
  height = 200,
  resolution = 200,
}: WaveVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(currentTime);

  const colors = customColors || colorSchemes[colorScheme];
  const gradientColors = colorSchemes[colorScheme]?.gradient || colorSchemes.calm.gradient;

  const curvePoints = useMemo(() => {
    return generateCurvePoints(equation, params, resolution);
  }, [equation, params, resolution]);

  useEffect(() => {
    timeRef.current = currentTime;
  }, [currentTime]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const canvasHeight = rect.height;
    const padding = 20;
    const graphWidth = width - padding * 2;
    const graphHeight = canvasHeight - padding * 2;

    const draw = () => {
      ctx.clearRect(0, 0, width, canvasHeight);

      // Background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
      bgGradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
      bgGradient.addColorStop(1, 'rgba(30, 41, 59, 0.95)');
      ctx.fillStyle = bgGradient;
      ctx.beginPath();
      ctx.roundRect(0, 0, width, canvasHeight, 12);
      ctx.fill();

      // Grid
      if (showGrid) {
        ctx.strokeStyle = colors.grid;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);

        // Vertical lines
        for (let i = 0; i <= 10; i++) {
          const x = padding + (i / 10) * graphWidth;
          ctx.beginPath();
          ctx.moveTo(x, padding);
          ctx.lineTo(x, canvasHeight - padding);
          ctx.stroke();
        }

        // Horizontal lines
        for (let i = 0; i <= 4; i++) {
          const y = padding + (i / 4) * graphHeight;
          ctx.beginPath();
          ctx.moveTo(padding, y);
          ctx.lineTo(width - padding, y);
          ctx.stroke();
        }

        ctx.setLineDash([]);
      }

      // Area under curve with gradient
      const areaGradient = ctx.createLinearGradient(0, padding, 0, canvasHeight - padding);
      areaGradient.addColorStop(0, `${gradientColors[0]}40`);
      areaGradient.addColorStop(0.5, `${gradientColors[1]}20`);
      areaGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = areaGradient;
      ctx.beginPath();
      ctx.moveTo(padding, canvasHeight - padding);

      curvePoints.forEach((point, i) => {
        const x = padding + point.t * graphWidth;
        const y = canvasHeight - padding - point.value * graphHeight;
        if (i === 0) {
          ctx.lineTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.lineTo(width - padding, canvasHeight - padding);
      ctx.closePath();
      ctx.fill();

      // Main curve with glow effect
      ctx.shadowColor = colors.primary;
      ctx.shadowBlur = 15;
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      curvePoints.forEach((point, i) => {
        const x = padding + point.t * graphWidth;
        const y = canvasHeight - padding - point.value * graphHeight;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Reset shadow
      ctx.shadowBlur = 0;

      // Derivative curve (velocity)
      if (showDerivative) {
        ctx.strokeStyle = 'rgba(255, 206, 86, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 3]);

        ctx.beginPath();
        for (let i = 1; i < curvePoints.length - 1; i++) {
          const derivative = (curvePoints[i + 1].value - curvePoints[i - 1].value) / (2 / resolution);
          const x = padding + curvePoints[i].t * graphWidth;
          const y = canvasHeight / 2 - derivative * (graphHeight / 4);
          if (i === 1) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Current time marker
      if (timeRef.current >= 0 && timeRef.current <= 1) {
        const markerX = padding + timeRef.current * graphWidth;
        const currentValue = equation.evaluate(timeRef.current, params);
        const markerY = canvasHeight - padding - currentValue * graphHeight;

        // Vertical line
        ctx.strokeStyle = `${colors.marker}80`;
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 4]);
        ctx.beginPath();
        ctx.moveTo(markerX, padding);
        ctx.lineTo(markerX, canvasHeight - padding);
        ctx.stroke();
        ctx.setLineDash([]);

        // Glowing dot
        ctx.shadowColor = colors.marker;
        ctx.shadowBlur = 20;
        ctx.fillStyle = colors.marker;
        ctx.beginPath();
        ctx.arc(markerX, markerY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Inner dot
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(markerX, markerY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Value label
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${(currentValue * 100).toFixed(0)}%`, markerX, markerY - 20);
      }

      // Axis labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('0', padding - 15, canvasHeight - padding + 4);
      ctx.fillText('1', width - padding + 5, canvasHeight - padding + 4);
      ctx.textAlign = 'right';
      ctx.fillText('0%', padding - 5, canvasHeight - padding);
      ctx.fillText('100%', padding - 5, padding + 4);

      // Time label
      ctx.textAlign = 'center';
      ctx.fillText('Tempo (t)', width / 2, canvasHeight - 4);

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [equation, params, curvePoints, isPlaying, showGrid, showDerivative, colors, gradientColors, resolution]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('w-full rounded-xl', className)}
      style={{ height }}
    />
  );
}
