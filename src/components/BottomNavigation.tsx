import { Home, BookOpen, User, Compass, MessageCircle } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Início', icon: Home },
  { path: '/guide', label: 'Guia', icon: MessageCircle },
  { path: '/journeys', label: 'Jornadas', icon: Compass },
  { path: '/journal', label: 'Diário', icon: BookOpen },
  { path: '/profile', label: 'Perfil', icon: User },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <motion.nav 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 25 }}
      className="fixed bottom-0 left-0 right-0 z-50 safe-bottom"
    >
      {/* Glass background with shadow */}
      <div className="absolute inset-0 glass shadow-[0_-4px_24px_hsl(var(--foreground)/0.06)]" />
      
      {/* Nav content - larger touch targets */}
      <div className="relative flex items-center justify-around px-1 py-3">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  'nav-item min-w-[4rem] min-h-[58px] px-2',
                  isActive && 'nav-item-active'
                )}
              >
                {/* Active glow */}
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-primary/15 rounded-2xl"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                
                {/* Active indicator line */}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                
                <Icon
                  className={cn(
                    'w-7 h-7 transition-all duration-200 relative z-10',
                    isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                  )}
                  strokeWidth={isActive ? 2.5 : 1.75}
                />
                <span
                  className={cn(
                    'text-sm font-semibold transition-colors relative z-10 mt-0.5',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </span>
              </motion.div>
            </NavLink>
          );
        })}
      </div>
    </motion.nav>
  );
}
