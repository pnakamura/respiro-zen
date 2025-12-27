import { Home, BookOpen, BarChart3, User, Utensils } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Início', icon: Home },
  { path: '/nutrition', label: 'Nutrição', icon: Utensils },
  { path: '/journal', label: 'Diário', icon: BookOpen },
  { path: '/insights', label: 'Insights', icon: BarChart3 },
  { path: '/profile', label: 'Perfil', icon: User },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <motion.nav 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 25 }}
      className="fixed bottom-0 left-0 right-0 z-50 safe-bottom"
    >
      {/* Glass background */}
      <div className="absolute inset-0 glass" />
      
      {/* Nav content */}
      <div className="relative flex items-center justify-around px-2 py-3">
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
                className={cn(
                  'nav-item min-w-[4.5rem]',
                  isActive && 'nav-item-active'
                )}
              >
                {/* Active glow */}
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-primary/10 rounded-2xl"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                
                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                
                <Icon
                  className={cn(
                    'w-5 h-5 transition-all duration-200 relative z-10',
                    isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={cn(
                    'text-[10px] font-semibold transition-colors relative z-10',
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