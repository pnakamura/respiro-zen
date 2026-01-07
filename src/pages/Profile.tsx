import { motion } from 'framer-motion';
import { User, Settings, LogOut, Bell, Moon, ChevronRight, Shield, Sparkles, Sun } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function Profile() {
  const navigate = useNavigate();
  const { user, usuario, signOut } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const firstName = usuario?.nome_completo?.split(' ')[0] || 'Usuário';
  const email = usuario?.email || user?.email || '';

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const isDarkMode = mounted && resolvedTheme === 'dark';

  return (
    <div className="min-h-[100dvh] flex flex-col pb-28">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-8 px-6 pb-6"
      >
        <h1 className="text-2xl font-bold text-foreground">Perfil</h1>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 px-6 space-y-5">
        {/* User Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-5 flex items-center gap-4"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-primary-foreground" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-foreground">{firstName}</h2>
            <p className="text-sm text-muted-foreground truncate">{email}</p>
            {usuario?.tipo_usuario && (
              <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full capitalize">
                {usuario.tipo_usuario}
              </span>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </motion.div>

        {/* Admin Link for socios */}
        {usuario?.tipo_usuario === 'socio' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/admin">
              <div className="card-elevated p-4 flex items-center gap-3 border-l-4 border-l-secondary">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-secondary" />
                </div>
                <span className="flex-1 text-sm font-semibold text-foreground">
                  Painel Administrativo
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
          </motion.div>
        )}

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated divide-y divide-border/50 overflow-hidden"
        >
          {/* Notifications */}
          <div className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
              <Bell className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="flex-1 text-sm font-medium text-foreground">
              Notificações
            </span>
            <Switch />
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
              {isDarkMode ? (
                <Moon className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Sun className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <span className="flex-1 text-sm font-medium text-foreground">
              Modo Escuro
            </span>
            <Switch
              checked={isDarkMode}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>

          {/* Privacy */}
          <div className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
              <Shield className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="flex-1 text-sm font-medium text-foreground">
              Privacidade
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>

          {/* Settings Link */}
          <Link to="/settings" className="block">
            <div className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                <Settings className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="flex-1 text-sm font-medium text-foreground">
                Configurações
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </Link>
        </motion.div>

        {/* Sign Out Button */}
        {user ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full h-12 rounded-2xl border-destructive/30 text-destructive hover:bg-destructive/5"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sair da Conta
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={() => navigate('/auth')}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20"
            >
              <User className="w-5 h-5 mr-2" />
              Entrar ou Criar Conta
            </Button>
          </motion.div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}