import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const LandingHeader: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Funcionalidades', id: 'features' },
    { label: 'Depoimentos', id: 'testimonials' },
    { label: 'Planos', id: 'pricing' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-landing-bg/80 backdrop-blur-xl shadow-sm border-b border-landing-lavender/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => scrollToSection('hero')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-landing-lavender to-landing-sage flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-landing-text" />
            </div>
            <span className="text-xl font-bold text-landing-text">ETHRA</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-landing-text/70 hover:text-landing-text font-medium transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-landing-sage group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              onClick={() => navigate('/auth?trial=true')}
              className="bg-gradient-to-r from-landing-sage to-landing-serene text-white font-semibold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105"
            >
              Começar Agora
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-landing-lavender/30 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-landing-text" />
            ) : (
              <Menu className="w-6 h-6 text-landing-text" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="text-left py-3 px-4 text-landing-text/80 hover:text-landing-text hover:bg-landing-lavender/20 rounded-xl font-medium transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
                <Button
                  onClick={() => navigate('/auth?trial=true')}
                  className="mt-2 bg-gradient-to-r from-landing-sage to-landing-serene text-white font-semibold rounded-full"
                >
                  Começar Agora
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};
