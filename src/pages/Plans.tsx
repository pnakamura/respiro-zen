import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Sparkles, Crown, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useToast } from '@/hooks/use-toast';

const plans = [
  {
    name: 'Mensal',
    price: '29,90',
    period: '/mês',
    description: 'Flexibilidade para começar sua jornada',
    features: [
      'Acesso ilimitado a todas as meditações',
      'Técnicas de respiração guiada',
      'Guia de meditação com IA',
      'Relatórios de bem-estar',
      'Jornadas de transformação',
    ],
    cta: 'Assinar Mensal',
    highlighted: false,
    planType: 'monthly',
  },
  {
    name: 'Anual',
    price: '19,90',
    period: '/mês',
    billing: 'Cobrado R$ 239,00/ano',
    badge: 'Economize 30%',
    description: 'O melhor custo-benefício para sua paz',
    features: [
      'Tudo do plano mensal',
      'Modo offline para praticar em qualquer lugar',
      'Acesso antecipado a novidades',
      'Conteúdos exclusivos',
      'Suporte prioritário',
    ],
    cta: 'Assinar Anual',
    highlighted: true,
    planType: 'annual',
  },
];

const trustBadges = [
  { icon: Clock, text: 'Cancele quando quiser' },
  { icon: Shield, text: 'Pagamento seguro' },
  { icon: Check, text: 'Garantia de 7 dias' },
];

const Plans: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubscribe = (planType: string) => {
    // TODO: Integrar com sistema de pagamento (Stripe)
    toast({
      title: 'Em breve!',
      description: 'Sistema de pagamento em implementação. Entre em contato para assinar.',
    });
  };

  return (
    <div className="min-h-[100dvh] bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="flex items-center justify-between px-5 py-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Escolha seu Plano</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-5 py-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Invista na sua paz interior
          </h2>
          <p className="text-muted-foreground text-sm">
            Desbloqueie todo o potencial do ETHRA para transformar sua jornada de bem-estar.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="space-y-4 mb-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-semibold shadow-lg flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    {plan.badge}
                  </div>
                </div>
              )}

              <div
                className={`p-5 rounded-2xl border-2 transition-all ${
                  plan.highlighted
                    ? 'bg-gradient-to-b from-card to-amber-500/5 border-amber-500/50 shadow-lg'
                    : 'bg-card border-border/50 shadow-sm'
                }`}
              >
                {/* Header */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-foreground mb-1">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{plan.description}</p>
                  
                  <div className="flex items-end justify-center gap-0.5">
                    <span className="text-sm text-muted-foreground">R$</span>
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground text-sm mb-1">{plan.period}</span>
                  </div>
                  
                  {plan.billing && (
                    <p className="text-xs text-muted-foreground mt-1">{plan.billing}</p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        plan.highlighted 
                          ? 'bg-amber-500/20' 
                          : 'bg-primary/10'
                      }`}>
                        <Check className={`w-3 h-3 ${plan.highlighted ? 'text-amber-500' : 'text-primary'}`} />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  onClick={() => handleSubscribe(plan.planType)}
                  className={`w-full h-12 rounded-xl font-semibold transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/20'
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-3 text-sm text-muted-foreground"
        >
          {trustBadges.map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-primary" />
              {text}
            </span>
          ))}
        </motion.div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Plans;
