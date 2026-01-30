import { useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

interface FluidParticlesProps {
  breathPhase: 'idle' | 'inhale' | 'holdIn' | 'exhale' | 'holdOut';
  progress: number; // 0 to 1
  colorScheme?: 'calm' | 'energy' | 'focus' | 'nature';
  particleCount?: number;
  className?: string;
  style?: React.CSSProperties;
}

const colorSchemes = {
  calm: ['#4ECDC4', '#45B7D1', '#96CEB4', '#88D8B0', '#7FDBFF'],
  energy: ['#FF6B6B', '#FFA07A', '#FFE66D', '#FF8C42', '#FFB347'],
  focus: ['#A78BFA', '#818CF8', '#6366F1', '#8B5CF6', '#C4B5FD'],
  nature: ['#88D8B0', '#A8E6CF', '#DCEDC1', '#C1E1C1', '#B2D3C2'],
};

export function FluidParticles({
  breathPhase,
  progress,
  colorScheme = 'calm',
  particleCount = 80,
  className,
  style,
}: FluidParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const centerRef = useRef({ x: 0, y: 0 });
  const breathValueRef = useRef(0);

  const colors = colorSchemes[colorScheme];

  const createParticle = useCallback(
    (x: number, y: number, centerX: number, centerY: number): Particle => {
      const angle = Math.atan2(y - centerY, x - centerX) + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 0.5 + 0.2;

      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.3,
        life: 0,
        maxLife: Math.random() * 100 + 100,
      };
    },
    [colors]
  );

  const initParticles = useCallback(
    (width: number, height: number) => {
      const centerX = width / 2;
      const centerY = height / 2;
      centerRef.current = { x: centerX, y: centerY };

      const particles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = Math.random() * 80 + 40;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        particles.push(createParticle(x, y, centerX, centerY));
      }
      particlesRef.current = particles;
    },
    [particleCount, createParticle]
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

    initParticles(width, height);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Calculate breath-based forces
      let targetBreathValue = 0;
      let breathForce = 0;

      switch (breathPhase) {
        case 'inhale':
          targetBreathValue = progress;
          breathForce = 2 + progress * 3; // Expanding outward
          break;
        case 'holdIn':
          targetBreathValue = 1;
          breathForce = 0.5; // Gentle wobble
          break;
        case 'exhale':
          targetBreathValue = 1 - progress;
          breathForce = -(1.5 + progress * 2); // Contracting inward
          break;
        case 'holdOut':
          targetBreathValue = 0;
          breathForce = -0.3; // Slight inward pull
          break;
        default:
          targetBreathValue = 0.5;
          breathForce = 0;
      }

      // Smooth breath value transition
      breathValueRef.current += (targetBreathValue - breathValueRef.current) * 0.1;
      const currentBreath = breathValueRef.current;

      // Draw background glow
      const glowRadius = 80 + currentBreath * 60;
      const gradient = ctx.createRadialGradient(
        centerRef.current.x,
        centerRef.current.y,
        0,
        centerRef.current.x,
        centerRef.current.y,
        glowRadius
      );
      gradient.addColorStop(0, `${colors[0]}30`);
      gradient.addColorStop(0.5, `${colors[1]}15`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      const particles = particlesRef.current;

      // Draw connections between nearby particles
      ctx.strokeStyle = `${colors[0]}20`;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particles[i].x;
          const dy = particles[j].y - particles[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 50) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.globalAlpha = (1 - distance / 50) * 0.3;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      particles.forEach((particle, index) => {
        // Calculate distance and angle from center
        const dx = particle.x - centerRef.current.x;
        const dy = particle.y - centerRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        // Apply breath force (radial)
        const radialForce = breathForce * 0.02;
        particle.vx += Math.cos(angle) * radialForce;
        particle.vy += Math.sin(angle) * radialForce;

        // Add circular motion (tangential force)
        const tangentialSpeed = 0.003 + currentBreath * 0.002;
        particle.vx += Math.cos(angle + Math.PI / 2) * tangentialSpeed;
        particle.vy += Math.sin(angle + Math.PI / 2) * tangentialSpeed;

        // Attraction to orbit radius
        const targetRadius = 60 + currentBreath * 80;
        const radiusDiff = targetRadius - distance;
        const attractionForce = radiusDiff * 0.002;
        particle.vx += Math.cos(angle) * attractionForce;
        particle.vy += Math.sin(angle) * attractionForce;

        // Apply friction
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Add slight noise for organic movement
        particle.vx += (Math.random() - 0.5) * 0.1;
        particle.vy += (Math.random() - 0.5) * 0.1;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Update life
        particle.life++;
        if (particle.life > particle.maxLife) {
          // Respawn particle
          const newAngle = Math.random() * Math.PI * 2;
          const newRadius = Math.random() * 30 + 50;
          particle.x = centerRef.current.x + Math.cos(newAngle) * newRadius;
          particle.y = centerRef.current.y + Math.sin(newAngle) * newRadius;
          particle.life = 0;
          particle.maxLife = Math.random() * 100 + 100;
          particle.color = colors[Math.floor(Math.random() * colors.length)];
        }

        // Calculate alpha based on life
        const lifeRatio = particle.life / particle.maxLife;
        const fadeIn = Math.min(lifeRatio * 5, 1);
        const fadeOut = Math.max(1 - (lifeRatio - 0.8) * 5, 0);
        const alpha = particle.alpha * fadeIn * (lifeRatio > 0.8 ? fadeOut : 1);

        // Dynamic radius based on breath
        const dynamicRadius = particle.radius * (0.8 + currentBreath * 0.4);

        // Draw particle with glow
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = dynamicRadius * 2;
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, dynamicRadius, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright core
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = alpha * 0.6;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, dynamicRadius * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // Draw center orb
      const orbRadius = 15 + currentBreath * 25;
      const orbGradient = ctx.createRadialGradient(
        centerRef.current.x,
        centerRef.current.y,
        0,
        centerRef.current.x,
        centerRef.current.y,
        orbRadius
      );
      orbGradient.addColorStop(0, `${colors[0]}ff`);
      orbGradient.addColorStop(0.4, `${colors[1]}cc`);
      orbGradient.addColorStop(0.7, `${colors[2]}66`);
      orbGradient.addColorStop(1, 'transparent');

      ctx.shadowColor = colors[0];
      ctx.shadowBlur = 30;
      ctx.fillStyle = orbGradient;
      ctx.beginPath();
      ctx.arc(centerRef.current.x, centerRef.current.y, orbRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [breathPhase, progress, colors, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('w-full h-full', className)}
      style={style}
    />
  );
}
