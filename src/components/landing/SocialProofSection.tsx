import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const stats = [
  { value: '+10.000', label: 'minutos meditados' },
  { value: '4.9', label: 'estrelas nas lojas', icon: Star },
  { value: '+5.000', label: 'usuários ativos' },
];

const testimonials = [
  {
    name: 'Mariana Costa',
    role: 'Designer',
    avatar: '👩‍🎨',
    quote: 'As trajetórias personalizadas mudaram minha relação com a meditação. Finalmente consigo manter uma rotina consistente!',
  },
  {
    name: 'Ricardo Alves',
    role: 'Desenvolvedor',
    avatar: '👨‍💻',
    quote: 'Uso as sessões de foco antes de reuniões importantes. A diferença na minha produtividade é incrível.',
  },
  {
    name: 'Ana Beatriz',
    role: 'Psicóloga',
    avatar: '👩‍⚕️',
    quote: 'Recomendo o ETHRA para meus pacientes com ansiedade. A técnica de respiração 4-7-8 é muito eficaz.',
  },
];

export const SocialProofSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 px-5 bg-gradient-to-b from-landing-bg to-landing-lavender/20">
      <div className="max-w-6xl mx-auto">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-3 gap-4 md:gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-landing-sage to-landing-serene">
                  {stat.value}
                </span>
                {stat.icon && <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-amber-400 fill-amber-400" />}
              </div>
              <p className="text-sm md:text-base text-landing-text/60">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-landing-sage/20 text-landing-text/70 text-sm font-medium mb-4">
            A Diferença
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-landing-text mb-4">
            O que nossos usuários dizem
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              <div className="h-full p-6 rounded-3xl bg-white border border-landing-lavender/30 shadow-sm hover:shadow-lg transition-all duration-300">
                {/* Quote Icon */}
                <div className="absolute -top-3 left-6">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-landing-sage to-landing-serene flex items-center justify-center">
                    <Quote className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Quote */}
                <p className="text-landing-text/70 leading-relaxed mt-4 mb-6">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-landing-lavender/50 flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-landing-text">{testimonial.name}</p>
                    <p className="text-sm text-landing-text/50">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
