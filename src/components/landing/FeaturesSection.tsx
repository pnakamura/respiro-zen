import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Brain, Heart } from 'lucide-react';

const features = [
  {
    icon: Moon,
    title: 'Durma Melhor',
    description: 'Histórias relaxantes e frequências sonoras cientificamente projetadas para um sono profundo e restaurador.',
    gradient: 'from-indigo-400 to-purple-500',
    bgLight: 'bg-indigo-50',
  },
  {
    icon: Brain,
    title: 'Foco Total',
    description: 'Sessões curtas de 5-15 minutos para aumentar sua produtividade e clareza mental durante o dia.',
    gradient: 'from-amber-400 to-orange-500',
    bgLight: 'bg-amber-50',
  },
  {
    icon: Heart,
    title: 'Controle da Ansiedade',
    description: 'Técnicas de respiração guiada para acalmar crises de ansiedade e recuperar o equilíbrio emocional.',
    gradient: 'from-rose-400 to-pink-500',
    bgLight: 'bg-rose-50',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 px-5 bg-landing-bg">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-landing-lavender/50 text-landing-text/70 text-sm font-medium mb-4">
            Por que o ETHRA?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-landing-text mb-4">
            Bem-estar completo em um só app
          </h2>
          <p className="text-landing-text/60 max-w-2xl mx-auto">
            Ferramentas poderosas para cuidar da sua saúde mental, com práticas personalizadas para cada momento do seu dia.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="h-full p-6 lg:p-8 rounded-3xl bg-white border border-landing-lavender/30 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${feature.bgLight} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-landing-text mb-3">
                  {feature.title}
                </h3>
                <p className="text-landing-text/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
