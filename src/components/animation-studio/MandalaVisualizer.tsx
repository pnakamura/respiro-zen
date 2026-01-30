import { useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { mathFunctions, AnimationEquation } from '@/lib/math-animations';

interface MandalaVisualizerProps {
  breathPhase: 'idle' | 'inhale' | 'holdIn' | 'exhale' | 'holdOut';
  progress: number;
  equation?: AnimationEquation;
  equationParams?: Record<string, number>;
  layers?: number;
  petalsPerLayer?: number;
  colorScheme?: 'lotus' | 'ocean' | 'sunset' | 'forest' | 'cosmic';
  rotationSpeed?: number;
  className?: string;
  style?: React.CSSProperties;
}

const colorSchemes = {
  lotus: {
    colors: ['#FF6B9D', '#C44569', '#FF8E72', '#FFB88C', '#DE6262'],
    glow: '#FF6B9D',
    center: '#FFE66D',
  },
  ocean: {
    colors: ['#4ECDC4', '#44A08D', '#093637', '#45B7D1', '#96CEB4'],
    glow: '#4ECDC4',
    center: '#FFFFFF',
  },
  sunset: {
    colors: ['#FF7E5F', '#FEB47B', '#FF6F61', '#DE4313', '#FF8C42'],
    glow: '#FF7E5F',
    center: '#FFE66D',
  },
  forest: {
    colors: ['#2D5016', '#4A7C23', '#7CB342', '#9CCC65', '#C5E1A5'],
    glow: '#7CB342',
    center: '#DCEDC8',
  },
  cosmic: {
    colors: ['#667EEA', '#764BA2', '#F093FB', '#4FACFE', '#00F2FE'],
    glow: '#667EEA',
    center: '#FFFFFF',
  },
};

export function MandalaVisualizer({
  breathPhase,
  progress,
  equation,
  equationParams = {},
  layers = 5,
  petalsPerLayer = 8,
  colorScheme = 'lotus',
  rotationSpeed = 0.5,
  className,
  style,
}: MandalaVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const rotationRef = useRef(0);
  const breathValueRef = useRef(0.5);
  const timeRef = useRef(0);

  const scheme = colorSchemes[colorScheme];

  const drawPetal = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      centerX: number,
      centerY: number,
      angle: number,
      length: number,
      width: number,
      color: string,
      alpha: number
    ) => {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);

      const gradient = ctx.createLinearGradient(0, 0, length, 0);
      gradient.addColorStop(0, `${color}00`);
      gradient.addColorStop(0.3, `${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(0.7, `${color}${Math.floor(alpha * 200).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, `${color}00`);

      ctx.fillStyle = gradient;
      ctx.beginPath();

      // Petal shape using bezier curves
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        length * 0.3,
        -width * 0.5,
        length * 0.7,
        -width * 0.4,
        length,
        0
      );
      ctx.bezierCurveTo(
        length * 0.7,
        width * 0.4,
        length * 0.3,
        width * 0.5,
        0,
        0
      );
      ctx.fill();

      // Inner highlight
      ctx.strokeStyle = `${color}40`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(length * 0.1, 0);
      ctx.lineTo(length * 0.9, 0);
      ctx.stroke();

      ctx.restore();
    },
    []
  );

  const drawSacredGeometry = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      centerX: number,
      centerY: number,
      radius: number,
      breath: number
    ) => {
      // Draw flower of life pattern
      const circleCount = 6;
      const circleRadius = radius * 0.3 * (0.8 + breath * 0.2);

      ctx.strokeStyle = `${scheme.glow}30`;
      ctx.lineWidth = 1;

      // Central circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Surrounding circles
      for (let i = 0; i < circleCount; i++) {
        const angle = (i / circleCount) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * circleRadius;
        const y = centerY + Math.sin(angle) * circleRadius;

        ctx.beginPath();
        ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    },
    [scheme]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.45;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      timeRef.current += 0.016; // ~60fps

      // Calculate target breath value
      let targetBreath = 0.5;
      if (breathPhase === 'inhale') {
        targetBreath = 0.5 + progress * 0.5;
      } else if (breathPhase === 'holdIn') {
        targetBreath = 1;
      } else if (breathPhase === 'exhale') {
        targetBreath = 1 - progress * 0.5;
      } else if (breathPhase === 'holdOut') {
        targetBreath = 0.5;
      }

      // Smooth breath transition
      breathValueRef.current += (targetBreath - breathValueRef.current) * 0.08;
      const breath = breathValueRef.current;

      // Apply equation if provided
      const equationValue = equation
        ? equation.evaluate(breath, equationParams)
        : breath;

      // Update rotation
      rotationRef.current += rotationSpeed * 0.01 * (0.5 + breath * 0.5);

      // Background glow
      const bgGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        maxRadius * 1.2
      );
      bgGradient.addColorStop(0, `${scheme.glow}20`);
      bgGradient.addColorStop(0.5, `${scheme.glow}10`);
      bgGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw sacred geometry background
      drawSacredGeometry(ctx, centerX, centerY, maxRadius, breath);

      // Draw mandala layers
      for (let layer = 0; layer < layers; layer++) {
        const layerProgress = layer / layers;
        const layerRadius = maxRadius * (0.2 + layerProgress * 0.8) * (0.7 + equationValue * 0.3);
        const petalCount = petalsPerLayer + layer * 4;
        const petalLength = layerRadius * (0.3 - layerProgress * 0.1);
        const petalWidth = petalLength * (0.4 - layerProgress * 0.1);

        const layerRotation =
          rotationRef.current * (layer % 2 === 0 ? 1 : -0.7) +
          layerProgress * Math.PI * 0.1;

        const color = scheme.colors[layer % scheme.colors.length];
        const alpha = 0.6 + (1 - layerProgress) * 0.4;

        // Add wave distortion based on equation
        const waveOffset = equation
          ? mathFunctions.sine(timeRef.current + layerProgress, 0.1, 2, layerProgress * Math.PI)
          : 0;

        for (let i = 0; i < petalCount; i++) {
          const angle = (i / petalCount) * Math.PI * 2 + layerRotation + waveOffset;
          const petalX = centerX + Math.cos(angle) * (layerRadius - petalLength * 0.5);
          const petalY = centerY + Math.sin(angle) * (layerRadius - petalLength * 0.5);

          drawPetal(ctx, petalX, petalY, angle, petalLength, petalWidth, color, alpha);
        }

        // Draw connecting rings
        ctx.strokeStyle = `${color}40`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, layerRadius * 0.95, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw center
      const centerRadius = maxRadius * 0.1 * (0.8 + equationValue * 0.4);

      // Center glow
      const centerGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        centerRadius * 2
      );
      centerGlow.addColorStop(0, scheme.center);
      centerGlow.addColorStop(0.3, `${scheme.glow}80`);
      centerGlow.addColorStop(1, 'transparent');

      ctx.shadowColor = scheme.center;
      ctx.shadowBlur = 30 * breath;
      ctx.fillStyle = centerGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2);
      ctx.fill();

      // Inner center
      ctx.shadowBlur = 0;
      ctx.fillStyle = scheme.center;
      ctx.beginPath();
      ctx.arc(centerX, centerY, centerRadius * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Om symbol or dot pattern in center
      const dotCount = 6;
      ctx.fillStyle = `${scheme.glow}80`;
      for (let i = 0; i < dotCount; i++) {
        const angle = (i / dotCount) * Math.PI * 2 + rotationRef.current * 2;
        const dotX = centerX + Math.cos(angle) * centerRadius * 0.7;
        const dotY = centerY + Math.sin(angle) * centerRadius * 0.7;
        const dotSize = 2 + breath * 2;

        ctx.beginPath();
        ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pulsing ring
      const pulseRadius = centerRadius + Math.sin(timeRef.current * 3) * 5 * breath;
      ctx.strokeStyle = `${scheme.center}60`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    breathPhase,
    progress,
    equation,
    equationParams,
    layers,
    petalsPerLayer,
    rotationSpeed,
    scheme,
    drawPetal,
    drawSacredGeometry,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('w-full h-full', className)}
      style={style}
    />
  );
}
