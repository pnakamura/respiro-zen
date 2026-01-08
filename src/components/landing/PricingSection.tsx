import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Mensal',
    price: '29,90',
    period: '/mês',
    description: 'Flexibilidade para começar sua jornada',
    features: [
      'Acesso ilimitado a todas as meditações',
      'Novas trajetórias toda semana',
      'Técnicas de respiração guiada',
      'Guia de meditação com IA',
      'Relatórios de bem-estar',
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

export const PricingSection: React.FC = () => {
  const navigate = useNavigate();

  const handleSubscribe = (planType: string) => {
    navigate(`/auth?plan=${planType}`);
  };

  return (
    <section id="pricing" className="py-20 px-5 bg-landing-bg">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-landing-sage/20 text-landing-text/70 text-sm font-medium mb-4">
            Planos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-landing-text mb-4">
            Invista na sua paz interior
          </h2>
          <p className="text-landing-text/60 max-w-xl mx-auto">
            Escolha o plano ideal para transformar sua saúde mental e conquistar equilíbrio duradouro.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-landing-sage to-landing-serene text-white text-sm font-semibold shadow-lg flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    {plan.badge}
                  </div>
                </div>
              )}

              <div
                className={`h-full p-6 lg:p-8 rounded-3xl border-2 transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-gradient-to-b from-white to-landing-lavender/20 border-landing-sage shadow-xl scale-[1.02]'
                    : 'bg-white border-landing-lavender/30 shadow-sm hover:shadow-lg'
                }`}
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-landing-text mb-2">{plan.name}</h3>
                  <p className="text-sm text-landing-text/60 mb-4">{plan.description}</p>
                  
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-sm text-landing-text/60">R$</span>
                    <span className="text-5xl font-bold text-landing-text">{plan.price}</span>
                    <span className="text-landing-text/60 mb-1">{plan.period}</span>
                  </div>
                  
                  {plan.billing && (
                    <p className="text-sm text-landing-text/50 mt-2">{plan.billing}</p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        plan.highlighted 
                          ? 'bg-gradient-to-br from-landing-sage to-landing-serene' 
                          : 'bg-landing-lavender/50'
                      }`}>
                        <Check className={`w-3 h-3 ${plan.highlighted ? 'text-white' : 'text-landing-text'}`} />
                      </div>
                      <span className="text-sm text-landing-text/70">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  onClick={() => handleSubscribe(plan.planType)}
                  className={`w-full py-6 rounded-2xl font-semibold text-base transition-all hover:scale-[1.02] ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-landing-sage to-landing-serene text-white shadow-lg hover:shadow-xl'
                      : 'bg-landing-lavender/50 text-landing-text hover:bg-landing-lavender'
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
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-landing-text/50"
        >
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-landing-sage" /> Cancele quando quiser
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-landing-sage" /> Pagamento seguro
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-landing-sage" /> Garantia de 7 dias
          </span>
        </motion.div>
      </div>
    </section>
  );
};
