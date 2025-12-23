import { motion } from 'framer-motion';
import { User, Settings, LogOut, Bell, Moon, ChevronRight, Shield } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, usuario, signOut } = useAuth();
  
  const firstName = usuario?.nome_completo?.split(' ')[0] || 'Usuário';
  const email = usuario?.email || user?.email || '';

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const menuItems = [
    { icon: Bell, label: 'Notificações', action: 'toggle' },
    { icon: Moon, label: 'Modo Escuro', action: 'toggle' },
    { icon: Shield, label: 'Privacidade', action: 'navigate' },
    { icon: Settings, label: 'Configurações', action: 'navigate' },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background pb-20">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-8 px-6 pb-6"
      >
        <h1 className="text-2xl font-bold text-foreground">Perfil</h1>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 px-6 space-y-6">
        {/* User Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">{firstName}</h2>
            <p className="text-sm text-muted-foreground">{email}</p>
            {usuario?.tipo_usuario && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full capitalize">
                {usuario.tipo_usuario}
              </span>
            )}
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Button>
        </motion.div>

        {/* Admin Link for socios */}
        {usuario?.tipo_usuario === 'socio' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/admin">
              <div className="bg-panic/10 rounded-xl p-4 flex items-center gap-3">
                <Settings className="w-5 h-5 text-panic" />
                <span className="flex-1 text-sm font-medium text-foreground">
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
          className="bg-card rounded-2xl divide-y divide-border"
        >
          {menuItems.map((item, index) => (
            <div
              key={item.label}
              className="flex items-center gap-3 p-4"
            >
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium text-foreground">
                {item.label}
              </span>
              {item.action === 'toggle' ? (
                <Switch />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          ))}
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
              className="w-full h-12 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/5"
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
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground"
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
