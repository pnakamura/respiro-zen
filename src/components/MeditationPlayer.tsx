import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, SkipBack, SkipForward, Volume2, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { MeditationTrack } from '@/types/breathing';
import { meditationTracks } from '@/data/emotions';
import { cn } from '@/lib/utils';

interface MeditationPlayerProps {
  onClose: () => void;
  onComplete: (durationSeconds: number) => void;
}

export function MeditationPlayer({ onClose, onComplete }: MeditationPlayerProps) {
  const [selectedTrack, setSelectedTrack] = useState<MeditationTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTrackSelect = (track: MeditationTrack) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    audioRef.current = new Audio(track.audioUrl);
    audioRef.current.volume = volume;
    
    audioRef.current.onloadedmetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };

    audioRef.current.ontimeupdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    audioRef.current.onended = () => {
      setIsPlaying(false);
      const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      onComplete(durationSeconds);
    };

    setSelectedTrack(track);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (currentTime === 0) {
        startTimeRef.current = Date.now();
      }
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const skipSeconds = (amount: number) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + amount));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-background"
    >
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between p-4"
      >
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Meditações
          </h2>
          <p className="text-sm text-muted-foreground">
            Escolha uma prática guiada
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>
      </motion.header>

      {/* Track list or player */}
      <div className="flex-1 overflow-auto px-4">
        <AnimatePresence mode="wait">
          {!selectedTrack ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3 pb-6"
            >
              {meditationTracks.map((track, index) => (
                <motion.button
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleTrackSelect(track)}
                  className={cn(
                    'w-full p-4 rounded-2xl glass text-left',
                    'flex items-center gap-4',
                    'hover:shadow-lg transition-all duration-300'
                  )}
                >
                  <div className="w-14 h-14 rounded-xl bg-meditate-light flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-meditate" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {track.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{track.category}</span>
                      <span>•</span>
                      <span>{track.duration}</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-meditate flex items-center justify-center">
                    <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full px-4"
            >
              {/* Album art placeholder */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: isPlaying ? [1, 1.02, 1] : 1 }}
                transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
                className="w-56 h-56 rounded-3xl bg-gradient-to-br from-meditate to-meditate/70 flex items-center justify-center shadow-[0_0_60px_10px_hsl(var(--meditate)/0.3)]"
              >
                <Headphones className="w-20 h-20 text-primary-foreground" />
              </motion.div>

              {/* Track info */}
              <div className="mt-8 text-center">
                <h3 className="text-xl font-semibold text-foreground">
                  {selectedTrack.title}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {selectedTrack.category}
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full mt-8 px-4">
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleSeek}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-3 mt-6 w-full max-w-xs px-4">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(v) => setVolume(v[0] / 100)}
                  className="flex-1"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-6 safe-bottom"
      >
        {selectedTrack ? (
          <div className="flex items-center justify-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedTrack(null)}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => skipSeconds(-15)}
              className="rounded-full w-12 h-12"
            >
              <SkipBack className="w-5 h-5" />
            </Button>

            <Button
              onClick={togglePlay}
              size="lg"
              className="rounded-full w-16 h-16 bg-gradient-to-br from-meditate to-meditate/70 text-primary-foreground"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7" />
              ) : (
                <Play className="w-7 h-7 ml-1" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => skipSeconds(15)}
              className="rounded-full w-12 h-12"
            >
              <SkipForward className="w-5 h-5" />
            </Button>

            <div className="w-12" /> {/* Spacer for symmetry */}
          </div>
        ) : (
          <Button
            onClick={onClose}
            variant="outline"
            size="lg"
            className="w-full rounded-full py-6"
          >
            Voltar
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}
