import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Play,
  Pause,
  RotateCcw,
  Settings2,
  X,
  Sparkles,
  Droplets,
  Snowflake,
  Globe,
  Zap,
  Cloud,
  Circle,
} from 'lucide-react';

// Types
type BreathPhase = 'idle' | 'inhale' | 'holdFull' | 'exhale' | 'holdEmpty' | 'complete';
type VisualMode = 'rings' | 'starDust' | 'fluid' | 'crystal' | 'topography' | 'bio' | 'atmosphere';

interface BreathConfig {
  inhaleTime: number;
  holdFullTime: number;
  exhaleTime: number;
  holdEmptyTime: number;
  cycles: number;
  visualMode: VisualMode;
  primaryColor: string;
  backgroundColor: string;
  complexity: number;
}

interface BreathVisualizationEngineProps {
  onClose?: () => void;
  onComplete?: (durationSeconds: number) => void;
  fullscreen?: boolean;
  initialConfig?: Partial<BreathConfig>;
}

const defaultConfig: BreathConfig = {
  inhaleTime: 4,
  holdFullTime: 4,
  exhaleTime: 4,
  holdEmptyTime: 4,
  cycles: 4,
  visualMode: 'rings',
  primaryColor: '#FFFFFF',
  backgroundColor: '#000000',
  complexity: 50,
};

const phaseNames: Record<BreathPhase, string> = {
  idle: 'PREPARAR',
  inhale: 'INSPIRE',
  holdFull: 'SEGURE',
  exhale: 'EXPIRE',
  holdEmpty: 'PAUSE',
  complete: 'COMPLETO',
};

const modeInfo: Record<VisualMode, { name: string; icon: React.ReactNode; description: string }> = {
  rings: { name: 'Anéis', icon: <Circle className="w-4 h-4" />, description: 'Anéis concêntricos que sobem e descem' },
  starDust: { name: 'Pó de Estrela', icon: <Sparkles className="w-4 h-4" />, description: 'Partículas com gravidade invertida' },
  fluid: { name: 'Fluido Viscoso', icon: <Droplets className="w-4 h-4" />, description: 'Tinta se dissolvendo na água' },
  crystal: { name: 'Cristalização', icon: <Snowflake className="w-4 h-4" />, description: 'Ordem emergindo do caos' },
  topography: { name: 'Topografia 3D', icon: <Globe className="w-4 h-4" />, description: 'Malha esférica elástica' },
  bio: { name: 'Bioluminescência', icon: <Zap className="w-4 h-4" />, description: 'Rede neural pulsante' },
  atmosphere: { name: 'Atmosfera', icon: <Cloud className="w-4 h-4" />, description: 'Eclipse e nevoeiro' },
};

// Easing functions for smooth animations
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInCubic = (t: number) => t * t * t;
const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutElastic = (t: number) => {
  if (t === 0 || t === 1) return t;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
};

// Utility to interpolate values
const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

export function BreathVisualizationEngine({
  onClose,
  onComplete,
  fullscreen = true,
  initialConfig,
}: BreathVisualizationEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const phaseStartTimeRef = useRef<number>(0);
  const dprRef = useRef<number>(1);

  const [config, setConfig] = useState<BreathConfig>(() => ({
    ...defaultConfig,
    ...initialConfig,
  }));
  const [phase, setPhase] = useState<BreathPhase>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [breathIntensity, setBreathIntensity] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Visualization state
  const visualStateRef = useRef<any>({
    particles: [],
    initialized: false,
    time: 0,
  });

  // Get logical canvas dimensions (without dpr)
  const getCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return { width: 800, height: 600, centerX: 400, centerY: 300 };
    const width = canvas.width / dprRef.current;
    const height = canvas.height / dprRef.current;
    return { width, height, centerX: width / 2, centerY: height / 2 };
  }, []);

  // Initialize visualization
  const initVisualization = useCallback(() => {
    const { width, height, centerX, centerY } = getCanvasDimensions();
    const state = visualStateRef.current;

    state.particles = [];
    state.connections = [];
    state.nodes = [];
    state.fogLayers = [];
    state.vertices = [];
    state.crystalPoints = [];
    state.time = 0;

    const count = config.complexity * 3;

    switch (config.visualMode) {
      case 'rings':
        // Concentric rings that rise and fall with breathing
        const ringCount = 10;
        state.rings = [];
        const maxRadius = Math.min(width, height) * 0.45;
        for (let i = 0; i < ringCount; i++) {
          const t = i / (ringCount - 1); // 0 to 1
          state.rings.push({
            baseRadius: maxRadius * (0.1 + t * 0.9), // Inner to outer
            index: i,
            // Y offset range: from flat (0) to stacked above (+height) or below (-height)
            yOffset: 0,
          });
        }
        state.perspectiveY = centerY + height * 0.15; // Slightly below center for 3D perspective
        break;

      case 'starDust':
        // Create particles at bottom - they will rise during inhale
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * Math.min(width, height) * 0.4;
          state.particles.push({
            // Start position (bottom, spread out)
            startX: centerX + (Math.random() - 0.5) * width * 0.8,
            startY: height + 20,
            // End position (top area, more centered)
            endX: centerX + Math.cos(angle) * dist * 0.5,
            endY: centerY - height * 0.3 + Math.sin(angle) * dist * 0.3,
            // Current position
            x: 0,
            y: 0,
            size: Math.random() * 4 + 2,
            brightness: Math.random() * 0.7 + 0.3,
            delay: Math.random() * 0.3, // Stagger animation
          });
        }
        break;

      case 'fluid':
        // Initialize fluid blobs that expand from center
        for (let i = 0; i < Math.floor(count / 3); i++) {
          const angle = (i / (count / 3)) * Math.PI * 2;
          state.particles.push({
            angle,
            baseRadius: 20 + Math.random() * 30,
            maxRadius: 150 + Math.random() * 100,
            x: centerX,
            y: centerY,
            size: Math.random() * 40 + 20,
            hueOffset: Math.random() * 40 - 20,
            phase: Math.random() * Math.PI * 2,
          });
        }
        break;

      case 'crystal':
        // Crystal structure with points that form/dissolve
        const sides = 6;
        const layers = 4;
        for (let l = 0; l < layers; l++) {
          const radius = 40 + l * 50;
          for (let i = 0; i < sides; i++) {
            const angle = (i / sides) * Math.PI * 2 - Math.PI / 2 + (l % 2) * (Math.PI / sides);
            state.crystalPoints.push({
              homeX: centerX + Math.cos(angle) * radius,
              homeY: centerY + Math.sin(angle) * radius,
              chaosX: centerX + (Math.random() - 0.5) * width * 0.6,
              chaosY: centerY + (Math.random() - 0.5) * height * 0.6,
              x: 0,
              y: 0,
              layer: l,
            });
          }
        }
        // Add center point
        state.crystalPoints.push({
          homeX: centerX,
          homeY: centerY,
          chaosX: centerX + (Math.random() - 0.5) * 100,
          chaosY: centerY + (Math.random() - 0.5) * 100,
          x: centerX,
          y: centerY,
          layer: -1,
        });
        break;

      case 'topography':
        const res = 24;
        const sphereRadius = Math.min(width, height) * 0.28;
        for (let i = 0; i <= res; i++) {
          state.vertices[i] = [];
          for (let j = 0; j <= res; j++) {
            const theta = (i / res) * Math.PI;
            const phi = (j / res) * Math.PI * 2;
            state.vertices[i][j] = {
              baseX: Math.sin(theta) * Math.cos(phi),
              baseY: Math.sin(theta) * Math.sin(phi),
              baseZ: Math.cos(theta),
              displacement: 0,
              noisePhase: Math.random() * Math.PI * 2,
              radius: sphereRadius,
            };
          }
        }
        state.rotation = 0;
        break;

      case 'bio':
        // Create neural network centered
        state.nodes.push({
          x: centerX,
          y: centerY,
          brightness: 0,
          isCenter: true,
          depth: 0,
        });

        const createBranches = (x: number, y: number, parentIndex: number, depth: number, length: number, baseAngle: number) => {
          if (depth <= 0) return;

          const branches = depth > 3 ? 4 : 3;
          const spreadAngle = Math.PI / (depth > 2 ? 2 : 3);

          for (let i = 0; i < branches; i++) {
            const angle = baseAngle + (i - (branches - 1) / 2) * spreadAngle / branches + (Math.random() - 0.5) * 0.3;
            const len = length * (0.65 + Math.random() * 0.2);
            const newX = x + Math.cos(angle) * len;
            const newY = y + Math.sin(angle) * len;

            // Keep within bounds
            const maxDist = Math.min(width, height) * 0.42;
            const distFromCenter = Math.hypot(newX - centerX, newY - centerY);
            if (distFromCenter > maxDist) continue;

            const nodeIndex = state.nodes.length;
            state.nodes.push({
              x: newX,
              y: newY,
              brightness: 0,
              isCenter: false,
              depth: 5 - depth,
            });

            state.connections.push({
              from: parentIndex,
              to: nodeIndex,
              progress: 0,
              depth: 5 - depth,
            });

            createBranches(newX, newY, nodeIndex, depth - 1, length * 0.7, angle);
          }
        };

        // Create branches in all directions from center
        const branchCount = 5;
        for (let i = 0; i < branchCount; i++) {
          const angle = (i / branchCount) * Math.PI * 2;
          createBranches(centerX, centerY, 0, 5, 120, angle);
        }
        break;

      case 'atmosphere':
        // Eclipse at center with surrounding fog
        state.lightIntensity = 0;
        state.coronaPhase = 0;
        for (let i = 0; i < 10; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * Math.min(width, height) * 0.5 + 100;
          state.fogLayers.push({
            x: centerX + Math.cos(angle) * dist,
            y: centerY + Math.sin(angle) * dist,
            baseX: centerX + Math.cos(angle) * dist,
            baseY: centerY + Math.sin(angle) * dist,
            size: Math.random() * 250 + 150,
            density: 0.6,
            driftAngle: Math.random() * Math.PI * 2,
            driftSpeed: 0.2 + Math.random() * 0.3,
          });
        }
        break;
    }

    state.initialized = true;
  }, [config.visualMode, config.complexity, getCanvasDimensions]);

  // Parse hex color to RGB
  const hexToRgb = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : { r: 78, g: 205, b: 196 };
  }, []);

  // Update visualization - uses progress for time-synced animations
  const updateVisualization = useCallback((
    intensity: number,
    currentPhase: BreathPhase,
    progress: number, // 0-1 progress within current phase
    frameTime: number
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height, centerX, centerY } = getCanvasDimensions();
    const state = visualStateRef.current;
    state.time += 0.016; // ~60fps time increment

    // Clear with background
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const rgb = hexToRgb(config.primaryColor);

    switch (config.visualMode) {
      case 'rings': {
        // Concentric rings animation
        // Inhale: rings rise and stack upward (0 -> 1)
        // HoldFull: rings stay stacked at top
        // Exhale: rings descend and go below/invert (1 -> 0)
        // HoldEmpty: rings stay stacked at bottom (inverted)

        if (!state.rings) break;

        const perspectiveY = state.perspectiveY || centerY + height * 0.15;
        const maxStackHeight = height * 0.35; // Maximum vertical displacement
        const easedIntensity = easeInOutCubic(intensity);

        // Calculate ring positions based on breath phase
        for (const ring of state.rings) {
          const ringIndex = ring.index;
          const ringCount = state.rings.length;
          const normalizedIndex = ringIndex / (ringCount - 1); // 0 to 1, inner to outer

          // Stack offset: inner rings go higher/lower, outer rings stay closer to center
          // When intensity = 1 (inhale complete): rings stacked above
          // When intensity = 0 (exhale complete): rings flat or stacked below

          if (currentPhase === 'inhale') {
            // Rings rise: inner rings go higher
            const stackFactor = 1 - normalizedIndex; // Inner = 1, outer = 0
            ring.yOffset = -easedIntensity * maxStackHeight * stackFactor;
          } else if (currentPhase === 'holdFull') {
            // Keep stacked at top with subtle floating
            const stackFactor = 1 - normalizedIndex;
            const baseOffset = -maxStackHeight * stackFactor;
            const float = Math.sin(state.time * 2 + ringIndex * 0.5) * 5;
            ring.yOffset = baseOffset + float;
          } else if (currentPhase === 'exhale') {
            // Rings descend and go below
            const stackFactor = 1 - normalizedIndex;
            // From stacked above (-maxStackHeight) to stacked below (+maxStackHeight)
            const targetOffset = maxStackHeight * stackFactor;
            const startOffset = -maxStackHeight * stackFactor;
            ring.yOffset = lerp(startOffset, targetOffset, easedIntensity);
          } else if (currentPhase === 'holdEmpty') {
            // Keep stacked at bottom with subtle settling
            const stackFactor = 1 - normalizedIndex;
            const baseOffset = maxStackHeight * stackFactor;
            const settle = Math.sin(state.time * 1.5 + ringIndex * 0.3) * 3;
            ring.yOffset = baseOffset + settle;
          } else {
            // Idle - flat
            ring.yOffset = 0;
          }
        }

        // Draw rings from back to front (outer to inner when above, inner to outer when below)
        // Sort rings by their Y position for proper depth ordering
        const sortedRings = [...state.rings].sort((a, b) => {
          // Rings with positive yOffset (below) should be drawn first
          // Then rings with negative yOffset (above) should be drawn last
          return b.yOffset - a.yOffset;
        });

        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9)`;
        ctx.lineWidth = 1.5;

        for (const ring of sortedRings) {
          const radius = ring.baseRadius;
          const yOffset = ring.yOffset;

          // 3D perspective: ellipse becomes more circular as it rises
          // and more flat as it approaches the viewing plane
          const perspectiveFactor = 0.25 + Math.abs(yOffset) / (height * 0.6) * 0.15;
          const ellipseHeight = radius * perspectiveFactor;

          // Position
          const x = centerX;
          const y = perspectiveY + yOffset;

          // Calculate alpha based on position (fade distant rings slightly)
          const distanceFromCenter = Math.abs(yOffset);
          const alpha = 0.6 + (1 - distanceFromCenter / maxStackHeight) * 0.4;

          ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;

          // Draw ellipse
          ctx.beginPath();
          ctx.ellipse(x, y, radius, ellipseHeight, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Add subtle glow for closer rings
          if (currentPhase === 'holdFull' || currentPhase === 'holdEmpty') {
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha * 0.2})`;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.ellipse(x, y, radius, ellipseHeight, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.lineWidth = 1.5;
          }
        }
        break;
      }

      case 'starDust': {
        // Calculate particle positions based on breath intensity
        // Inhale: particles rise from bottom to top (intensity 0->1)
        // HoldFull: particles float at top with subtle movement
        // Exhale: particles descend (intensity 1->0)
        // HoldEmpty: particles rest at bottom

        for (const p of state.particles) {
          const delayedProgress = Math.max(0, Math.min(1, (progress - p.delay) / (1 - p.delay)));
          const easedIntensity = easeInOutCubic(intensity);

          // Interpolate position based on intensity
          p.x = lerp(p.startX, p.endX, easedIntensity);
          p.y = lerp(p.startY, p.endY, easedIntensity);

          // Add floating motion during hold phases
          if (currentPhase === 'holdFull') {
            const floatAmount = 15;
            p.x += Math.sin(state.time * 2 + p.startX * 0.01) * floatAmount;
            p.y += Math.cos(state.time * 1.5 + p.startY * 0.01) * floatAmount * 0.5;
          } else if (currentPhase === 'holdEmpty') {
            // Subtle settling at bottom
            p.y = Math.min(height - 10, p.y + Math.sin(state.time + p.startX * 0.02) * 2);
          }

          // Calculate visual properties
          let alpha = p.brightness;
          let size = p.size;

          if (currentPhase === 'holdFull') {
            // Pulsing glow at full
            alpha *= 0.8 + 0.2 * Math.sin(state.time * 3 + p.startX * 0.02);
            size *= 1.3;
          } else if (currentPhase === 'holdEmpty') {
            alpha *= 0.15;
            size *= 0.6;
          } else {
            alpha *= 0.2 + easedIntensity * 0.8;
          }

          // Draw glow layers
          for (let i = 3; i > 0; i--) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha * 0.15 / i})`;
            ctx.arc(p.x, p.y, size * i * 2.5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Draw core
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'fluid': {
        // Fluid expands from center on inhale, contracts on exhale
        const easedIntensity = easeInOutSine(intensity);

        ctx.globalCompositeOperation = 'lighter';

        for (const p of state.particles) {
          // Calculate current radius based on intensity
          const currentRadius = lerp(p.baseRadius, p.maxRadius, easedIntensity);

          // Position around center
          const wobble = currentPhase === 'holdFull'
            ? Math.sin(state.time * 2 + p.phase) * 20
            : Math.sin(state.time + p.phase) * 5;

          const x = centerX + Math.cos(p.angle + state.time * 0.1) * (currentRadius + wobble);
          const y = centerY + Math.sin(p.angle + state.time * 0.1) * (currentRadius + wobble);

          // Size varies with intensity
          const size = p.size * (0.5 + easedIntensity * 0.8);

          // Draw fluid blob with multiple layers
          const alpha = currentPhase === 'holdEmpty' ? 0.05 : 0.15 + easedIntensity * 0.15;

          for (let i = 4; i > 0; i--) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha / i})`;
            ctx.arc(x, y, size * i * 0.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.globalCompositeOperation = 'source-over';
        break;
      }

      case 'crystal': {
        // Crystal forms on exhale (order from chaos), dissolves on inhale
        // Inverted from intensity: 0 = formed crystal, 1 = chaos
        const chaosLevel = intensity; // 1 = full chaos (inhale), 0 = crystal (exhale complete)
        const easedChaos = easeInOutCubic(chaosLevel);

        // Update point positions
        for (const p of state.crystalPoints) {
          p.x = lerp(p.homeX, p.chaosX, easedChaos);
          p.y = lerp(p.homeY, p.chaosY, easedChaos);

          // Add subtle movement
          if (currentPhase === 'holdFull') {
            // Chaotic movement when holding full breath
            p.x += Math.sin(state.time * 3 + p.homeX * 0.1) * 15;
            p.y += Math.cos(state.time * 2.5 + p.homeY * 0.1) * 15;
          } else if (currentPhase === 'holdEmpty') {
            // Subtle crystal vibration
            p.x += Math.sin(state.time * 5 + p.layer) * 2;
            p.y += Math.cos(state.time * 4 + p.layer) * 2;
          }
        }

        // Draw crystal structure (connections) when forming
        const structureAlpha = 1 - easedChaos;
        if (structureAlpha > 0.05) {
          ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${structureAlpha * 0.5})`;
          ctx.lineWidth = 1.5;

          for (let i = 0; i < state.crystalPoints.length; i++) {
            for (let j = i + 1; j < state.crystalPoints.length; j++) {
              const p1 = state.crystalPoints[i];
              const p2 = state.crystalPoints[j];
              const homeDist = Math.hypot(p1.homeX - p2.homeX, p1.homeY - p2.homeY);

              // Connect nearby points
              if (homeDist < 80) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
              }
            }
          }
        }

        // Draw points
        for (const p of state.crystalPoints) {
          const size = p.layer === -1 ? 10 : 6 - p.layer * 0.5;
          const alpha = 0.4 + structureAlpha * 0.5;

          // Draw glow
          ctx.beginPath();
          ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha * 0.3})`;
          ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
          ctx.fill();

          // Draw hexagon when crystallized
          if (structureAlpha > 0.5 && currentPhase !== 'inhale') {
            ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
              const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
              const hx = p.x + Math.cos(angle) * size;
              const hy = p.y + Math.sin(angle) * size;
              if (i === 0) ctx.moveTo(hx, hy);
              else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
      }

      case 'topography': {
        const res = state.vertices.length - 1;
        const easedIntensity = easeInOutSine(intensity);

        // Update rotation based on phase
        if (currentPhase === 'inhale' || currentPhase === 'exhale') {
          state.rotation += 0.008;
        } else {
          state.rotation += 0.003;
        }

        // Update vertex displacements based on intensity
        for (let i = 0; i <= res; i++) {
          for (let j = 0; j <= res; j++) {
            const v = state.vertices[i]?.[j];
            if (!v) continue;

            // Displacement follows intensity
            const noiseVal = Math.sin(v.baseX * 3 + state.time) * Math.cos(v.baseY * 3 + state.time * 0.8);
            const targetDisp = Math.abs(noiseVal) * easedIntensity * 60;

            // Smooth transition
            v.displacement += (targetDisp - v.displacement) * 0.15;
          }
        }

        // Project and draw mesh
        const getProjected = (i: number, j: number) => {
          const v = state.vertices[i]?.[j];
          if (!v) return null;

          const r = v.radius + v.displacement;
          let x = v.baseX * r;
          let y = v.baseY * r;
          let z = v.baseZ * r;

          // Rotate around Y axis
          const cosR = Math.cos(state.rotation);
          const sinR = Math.sin(state.rotation);
          const tempX = x * cosR - z * sinR;
          z = x * sinR + z * cosR;
          x = tempX;

          // Simple perspective
          const scale = 300 / (300 + z * 0.3);

          return {
            x: centerX + x * scale,
            y: centerY + y * scale,
            z,
            glow: v.displacement / 60,
          };
        };

        // Draw mesh lines
        const baseAlpha = currentPhase === 'holdEmpty' ? 0.2 : 0.3 + easedIntensity * 0.4;
        ctx.lineWidth = currentPhase === 'holdFull' ? 1.5 : 1;

        for (let i = 0; i < res; i++) {
          for (let j = 0; j < res; j++) {
            const p1 = getProjected(i, j);
            const p2 = getProjected(i + 1, j);
            const p3 = getProjected(i, j + 1);

            if (!p1 || !p2 || !p3) continue;

            // Color based on glow/displacement
            if (currentPhase === 'holdFull' && p1.glow > 0.4) {
              ctx.strokeStyle = `rgba(255, 255, 255, ${baseAlpha + p1.glow * 0.4})`;
            } else {
              ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${baseAlpha})`;
            }

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.stroke();
          }
        }
        break;
      }

      case 'bio': {
        // Bioluminescence spreads from center on inhale, recedes on exhale
        const easedIntensity = easeOutCubic(intensity);
        const maxDepth = 5;

        // Update node brightness and connection progress based on intensity
        for (const n of state.nodes) {
          if (n.isCenter) {
            n.brightness = 0.3 + easedIntensity * 0.7;
          } else {
            // Brightness propagates outward based on depth and intensity
            const depthProgress = (easedIntensity * maxDepth) - n.depth;
            const targetBrightness = Math.max(0, Math.min(1, depthProgress));
            n.brightness += (targetBrightness - n.brightness) * 0.2;
          }

          // Add pulsing during hold phases
          if (currentPhase === 'holdFull') {
            n.brightness *= 0.85 + 0.15 * Math.sin(state.time * 3 + n.x * 0.01);
          } else if (currentPhase === 'holdEmpty' && n.isCenter) {
            n.brightness = 0.1 + 0.08 * Math.sin(state.time * 2);
          }
        }

        for (const c of state.connections) {
          const depthProgress = (easedIntensity * maxDepth) - c.depth;
          const targetProgress = Math.max(0, Math.min(1, depthProgress));
          c.progress += (targetProgress - c.progress) * 0.2;

          if (currentPhase === 'holdEmpty') {
            c.progress *= 0.98;
          }
        }

        // Draw connections
        for (const c of state.connections) {
          const from = state.nodes[c.from];
          const to = state.nodes[c.to];
          if (!from || !to || c.progress < 0.01) continue;

          // Draw connection with glow
          for (let i = 3; i > 0; i--) {
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${c.progress * 0.4 / i})`;
            ctx.lineWidth = i * 2;
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            // Partial line based on progress
            const lx = lerp(from.x, to.x, c.progress);
            const ly = lerp(from.y, to.y, c.progress);
            ctx.lineTo(lx, ly);
            ctx.stroke();
          }
        }

        // Draw nodes
        for (const n of state.nodes) {
          if (n.brightness < 0.01) continue;

          const size = n.isCenter ? 12 : 6;

          // Glow layers
          for (let i = 4; i > 0; i--) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${n.brightness * 0.15 / i})`;
            ctx.arc(n.x, n.y, size * i * 2, 0, Math.PI * 2);
            ctx.fill();
          }

          // Core
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${n.brightness})`;
          ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'atmosphere': {
        // Eclipse: light emerges during inhale, dims during exhale
        const easedIntensity = easeInOutSine(intensity);
        state.lightIntensity = easedIntensity;
        state.coronaPhase += currentPhase === 'holdFull' ? 0.03 : 0.01;

        // Update fog density
        const targetDensity = currentPhase === 'holdEmpty' ? 0.9 :
                              currentPhase === 'holdFull' ? 0.1 :
                              0.8 - easedIntensity * 0.7;

        for (const f of state.fogLayers) {
          f.density += (targetDensity - f.density) * 0.1;

          // Gentle drift
          f.x = f.baseX + Math.cos(state.time * f.driftSpeed + f.driftAngle) * 30;
          f.y = f.baseY + Math.sin(state.time * f.driftSpeed * 0.7 + f.driftAngle) * 20;
        }

        // Draw corona/light rays
        ctx.globalCompositeOperation = 'lighter';

        const baseSize = 80;
        const expandedSize = baseSize + state.lightIntensity * 200;

        // Outer corona rays
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2 + state.coronaPhase;
          const rayLength = expandedSize * (1.5 + 0.3 * Math.sin(state.coronaPhase * 3 + i));

          const gradient = ctx.createLinearGradient(
            centerX, centerY,
            centerX + Math.cos(angle) * rayLength,
            centerY + Math.sin(angle) * rayLength
          );
          gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${state.lightIntensity * 0.3})`);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 20 + state.lightIntensity * 15;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(
            centerX + Math.cos(angle) * rayLength,
            centerY + Math.sin(angle) * rayLength
          );
          ctx.stroke();
        }

        // Inner glow layers
        for (let i = 6; i > 0; i--) {
          const alpha = state.lightIntensity * 0.12 / i;
          ctx.beginPath();
          ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
          ctx.arc(centerX, centerY, expandedSize * i * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Bright core
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${state.lightIntensity * 0.9})`;
        ctx.arc(centerX, centerY, expandedSize * 0.25, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalCompositeOperation = 'source-over';

        // Draw fog layers
        for (const f of state.fogLayers) {
          for (let i = 3; i > 0; i--) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(15, 15, 25, ${f.density * 0.25 / i})`;
            ctx.arc(f.x, f.y, f.size * i * 0.7, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Vignette during exhale/holdEmpty
        if (currentPhase === 'exhale' || currentPhase === 'holdEmpty') {
          const vignetteIntensity = currentPhase === 'holdEmpty' ? 0.85 : (1 - easedIntensity) * 0.6;

          const gradient = ctx.createRadialGradient(
            centerX, centerY, Math.min(width, height) * 0.2,
            centerX, centerY, Math.min(width, height) * 0.7
          );
          gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
          gradient.addColorStop(1, `rgba(0, 0, 0, ${vignetteIntensity})`);

          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, width, height);
        }
        break;
      }
    }
  }, [config.visualMode, config.primaryColor, config.backgroundColor, getCanvasDimensions, hexToRgb]);

  // Main animation loop
  const animate = useCallback((timestamp: number) => {
    if (!isRunning) return;

    const now = performance.now();
    const phaseElapsed = now - phaseStartTimeRef.current;

    // Get phase duration
    let duration = 1000; // Default 1 second minimum
    switch (phase) {
      case 'inhale': duration = config.inhaleTime * 1000; break;
      case 'holdFull': duration = config.holdFullTime * 1000; break;
      case 'exhale': duration = config.exhaleTime * 1000; break;
      case 'holdEmpty': duration = config.holdEmptyTime * 1000; break;
    }

    // Handle zero-duration phases
    if (duration <= 0) duration = 1;

    const progress = Math.min(1, phaseElapsed / duration);
    setPhaseProgress(progress);

    // Calculate breath intensity with smooth easing
    let newIntensity = 0;
    switch (phase) {
      case 'inhale': newIntensity = easeInOutSine(progress); break;
      case 'holdFull': newIntensity = 1; break;
      case 'exhale': newIntensity = 1 - easeInOutSine(progress); break;
      case 'holdEmpty': newIntensity = 0; break;
    }
    setBreathIntensity(newIntensity);

    // Update visualization with progress
    updateVisualization(newIntensity, phase, progress, timestamp);

    // Phase transitions
    if (progress >= 1) {
      let nextPhase: BreathPhase = 'idle';
      let newCycle = currentCycle;

      switch (phase) {
        case 'inhale':
          nextPhase = config.holdFullTime > 0 ? 'holdFull' : 'exhale';
          break;
        case 'holdFull':
          nextPhase = 'exhale';
          break;
        case 'exhale':
          nextPhase = config.holdEmptyTime > 0 ? 'holdEmpty' : 'inhale';
          if (config.holdEmptyTime <= 0) newCycle++;
          break;
        case 'holdEmpty':
          newCycle++;
          nextPhase = 'inhale';
          break;
      }

      // Check if cycles complete
      if (newCycle > config.cycles) {
        setPhase('complete');
        setIsRunning(false);
        const totalDuration = Math.round((now - startTimeRef.current) / 1000);
        onComplete?.(totalDuration);
        return;
      }

      setCurrentCycle(newCycle);
      setPhase(nextPhase);
      phaseStartTimeRef.current = now;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isRunning, phase, config, currentCycle, updateVisualization, onComplete]);

  // Start breathing
  const startBreathing = useCallback(async () => {
    // Countdown
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise(r => setTimeout(r, 1000));
    }
    setCountdown(0);

    initVisualization();
    setPhase('inhale');
    setCurrentCycle(1);
    setIsRunning(true);
    startTimeRef.current = performance.now();
    phaseStartTimeRef.current = performance.now();
  }, [initVisualization]);

  // Stop
  const stopBreathing = useCallback(() => {
    setIsRunning(false);
    setPhase('idle');
    setCurrentCycle(0);
    setPhaseProgress(0);
    setBreathIntensity(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  // Canvas setup with proper DPR handling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      dprRef.current = dpr;

      const rect = canvas.getBoundingClientRect();
      const width = fullscreen ? window.innerWidth : rect.width || 800;
      const height = fullscreen ? window.innerHeight : rect.height || 600;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      if (visualStateRef.current.initialized) {
        initVisualization();
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, [initVisualization, fullscreen]);

  // Animation loop
  useEffect(() => {
    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, animate]);

  // Initialize on mode change
  useEffect(() => {
    if (visualStateRef.current.initialized) {
      initVisualization();
    }
  }, [config.visualMode, config.complexity, initVisualization]);

  const remainingTime = Math.ceil(
    ((phase === 'inhale' ? config.inhaleTime :
      phase === 'holdFull' ? config.holdFullTime :
      phase === 'exhale' ? config.exhaleTime :
      config.holdEmptyTime) * 1000 * (1 - phaseProgress)) / 1000
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'bg-black flex flex-col',
        fullscreen ? 'fixed inset-0 z-50' : 'relative w-full h-full min-h-[600px]'
      )}
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <div>
          <h2 className="text-xl font-semibold text-white/90">Motor de Respiração</h2>
          <p className="text-sm text-white/60">{modeInfo[config.visualMode].name}</p>
        </div>

        <div className="flex items-center gap-2">
          <Sheet open={showSettings} onOpenChange={setShowSettings}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10">
                <Settings2 className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-slate-900 border-slate-800 text-white overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-white">Configurações</SheetTitle>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Timing */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-white/80">Tempos (segundos)</h3>

                  {[
                    { key: 'inhaleTime', label: 'Inspirar' },
                    { key: 'holdFullTime', label: 'Segurar (cheio)' },
                    { key: 'exhaleTime', label: 'Expirar' },
                    { key: 'holdEmptyTime', label: 'Segurar (vazio)' },
                  ].map(({ key, label }) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">{label}</span>
                        <Badge variant="secondary" className="bg-white/10">
                          {config[key as keyof BreathConfig]}s
                        </Badge>
                      </div>
                      <Slider
                        value={[config[key as keyof BreathConfig] as number]}
                        onValueChange={([v]) => setConfig(c => ({ ...c, [key]: v }))}
                        min={0}
                        max={10}
                        step={0.5}
                        className="[&_[role=slider]]:bg-teal-500"
                      />
                    </div>
                  ))}

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Ciclos</span>
                      <Badge variant="secondary" className="bg-white/10">{config.cycles}</Badge>
                    </div>
                    <Slider
                      value={[config.cycles]}
                      onValueChange={([v]) => setConfig(c => ({ ...c, cycles: v }))}
                      min={1}
                      max={10}
                      step={1}
                      className="[&_[role=slider]]:bg-teal-500"
                    />
                  </div>
                </div>

                {/* Visual Mode */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Modo Visual</label>
                  <Select
                    value={config.visualMode}
                    onValueChange={(v) => setConfig(c => ({ ...c, visualMode: v as VisualMode }))}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800">
                      {Object.entries(modeInfo).map(([key, { name, icon, description }]) => (
                        <SelectItem key={key} value={key} className="text-white focus:bg-white/10">
                          <div className="flex items-center gap-2">
                            {icon}
                            <div>
                              <div>{name}</div>
                              <div className="text-xs text-white/50">{description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Presets */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Presets</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Box', i: 4, hf: 4, e: 4, he: 4 },
                      { name: '4-7-8', i: 4, hf: 7, e: 8, he: 0 },
                      { name: 'Coerência', i: 5, hf: 0, e: 5, he: 0 },
                      { name: 'Energia', i: 4, hf: 0, e: 2, he: 0 },
                    ].map(preset => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10"
                        onClick={() => setConfig(c => ({
                          ...c,
                          inhaleTime: preset.i,
                          holdFullTime: preset.hf,
                          exhaleTime: preset.e,
                          holdEmptyTime: preset.he,
                        }))}
                      >
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Complexity */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Complexidade</span>
                    <Badge variant="secondary" className="bg-white/10">{config.complexity}</Badge>
                  </div>
                  <Slider
                    value={[config.complexity]}
                    onValueChange={([v]) => setConfig(c => ({ ...c, complexity: v }))}
                    min={10}
                    max={100}
                    step={5}
                    className="[&_[role=slider]]:bg-teal-500"
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10">
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Cycle indicator */}
      {isRunning && phase !== 'idle' && phase !== 'complete' && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {Array.from({ length: config.cycles }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-all',
                i < currentCycle - 1 ? 'bg-teal-500/50' :
                i === currentCycle - 1 ? 'bg-teal-500 shadow-[0_0_15px_rgba(78,205,196,0.8)]' :
                'bg-white/20'
              )}
            />
          ))}
        </div>
      )}

      {/* Phase indicator */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center z-10">
        <AnimatePresence mode="wait">
          {countdown > 0 ? (
            <motion.div
              key={`countdown-${countdown}`}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="text-8xl font-thin text-white"
            >
              {countdown}
            </motion.div>
          ) : isRunning && phase !== 'complete' ? (
            <motion.div
              key={phase}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              <div className="text-4xl font-light text-white tracking-[0.3em] mb-3">
                {phaseNames[phase]}
              </div>
              <div className="text-6xl font-thin text-white/80">
                {remainingTime}
              </div>
            </motion.div>
          ) : phase === 'complete' ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-light text-teal-400"
            >
              COMPLETO
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl text-white/60"
            >
              Pressione iniciar
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      {isRunning && (
        <div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-100"
          style={{ width: `${phaseProgress * 100}%` }}
        />
      )}

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
        {!isRunning && phase !== 'complete' && (
          <Button
            onClick={startBreathing}
            size="lg"
            className="rounded-full w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 shadow-[0_0_40px_rgba(78,205,196,0.4)]"
          >
            <Play className="w-8 h-8 ml-1" />
          </Button>
        )}

        {isRunning && (
          <Button
            onClick={stopBreathing}
            size="lg"
            variant="outline"
            className="rounded-full w-16 h-16 border-white/30 text-white hover:bg-white/10"
          >
            <Pause className="w-6 h-6" />
          </Button>
        )}

        {phase === 'complete' && (
          <>
            <Button
              onClick={() => {
                stopBreathing();
              }}
              size="lg"
              variant="outline"
              className="rounded-full px-8 border-white/30 text-white hover:bg-white/10"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Repetir
            </Button>
            {onClose && (
              <Button
                onClick={onClose}
                size="lg"
                className="rounded-full px-8 bg-gradient-to-br from-teal-500 to-cyan-500"
              >
                Concluir
              </Button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
