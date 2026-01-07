import { motion } from 'framer-motion';
import { ArrowLeft, Moon, Sun, Monitor, Lock, Info, ChevronRight, Palette, Shield, Smartphone, Download, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { usePWAInstall } from '@/hooks/usePWAInstall';

type ThemeOption = 'light' | 'dark' | 'system';

export default function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePWAInstall();

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeOptions: { value: ThemeOption; label: string; icon: React.ElementType }[] = [
    { value: 'light', label: 'Claro', icon: Sun },
    { value: 'dark', label: 'Escuro', icon: Moon },
    { value: 'system', label: 'Sistema', icon: Monitor },
  ];

  const currentTheme = (theme as ThemeOption) || 'system';

  return (
    <div className="min-h-[100dvh] flex flex-col pb-28 bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-8 px-6 pb-6"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors dark:border-glow"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-2xl font-bold text-foreground dark:text-glow">Configurações</h1>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 px-6 space-y-6">
        {/* Appearance Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-3 px-1">
            <Palette className="w-4 h-4 text-primary dark:icon-glow" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider dark:text-glow">
              Aparência
            </h2>
          </div>
          
          <div className="card-elevated p-4 space-y-4 dark:border-glow dark:card-glow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Tema</span>
              {mounted && (
                <span className="text-xs text-muted-foreground capitalize">
                  {resolvedTheme === 'dark' ? 'Escuro' : 'Claro'}
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = currentTheme === option.value;
                
                return (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200",
                      isSelected 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 dark:shadow-primary/40 dark:btn-glow-primary" 
                        : "bg-muted hover:bg-muted/80 text-muted-foreground dark:hover:border-glow"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isSelected && "dark:icon-glow")} />
                    <span className="text-xs font-medium">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* App Installation Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-3 px-1">
            <Smartphone className="w-4 h-4 text-primary dark:icon-glow" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider dark:text-glow">
              Aplicativo
            </h2>
          </div>
          
          <div className="card-elevated p-4 dark:border-glow dark:card-glow">
            {isInstalled ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground block">Aplicativo Instalado</span>
                  <span className="text-xs text-muted-foreground">
                    ETHRA está na sua tela inicial
                  </span>
                </div>
              </div>
            ) : isIOS ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Instalar no iPhone/iPad</span>
                </div>
                <ol className="text-xs text-muted-foreground space-y-1 pl-12">
                  <li>1. Toque em ⬆️ (Compartilhar)</li>
                  <li>2. Toque em "Adicionar à Tela de Início"</li>
                </ol>
              </div>
            ) : (
              <button
                onClick={promptInstall}
                disabled={!isInstallable}
                className="w-full flex items-center justify-between hover:bg-muted/30 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Download className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-medium text-foreground block">Instalar Aplicativo</span>
                    <span className="text-xs text-muted-foreground">
                      {isInstallable ? 'Acesse direto da sua tela inicial' : 'Disponível via navegador compatível'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </motion.section>

        {/* Privacy & Security Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3 px-1">
            <Lock className="w-4 h-4 text-primary dark:icon-glow" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider dark:text-glow">
              Privacidade
            </h2>
          </div>
          
          <div className="card-elevated divide-y divide-border/50 overflow-hidden dark:border-glow dark:card-glow">
            <button 
              onClick={() => navigate('/privacy')}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  Política de Privacidade
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            
            <button 
              onClick={() => navigate('/privacy#liability')}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  Termos de Uso
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </motion.section>

        {/* About Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-3 px-1">
            <Info className="w-4 h-4 text-primary dark:icon-glow" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider dark:text-glow">
              Sobre
            </h2>
          </div>
          
          <div className="card-elevated p-4 dark:border-glow dark:card-glow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Versão</span>
              <span className="text-sm text-muted-foreground dark:text-glow">1.0.0</span>
            </div>
          </div>
        </motion.section>
      </main>

      <BottomNavigation />
    </div>
  );
}
