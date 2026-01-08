import React from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Preciso ter experiência em meditação?',
    answer:
      'Não! O ETHRA foi criado para todos os níveis. Se você é iniciante, nossas trajetórias guiadas vão te ensinar desde o básico, com sessões curtas de 5 minutos. Praticantes experientes também encontram conteúdos avançados para aprofundar a prática.',
  },
  {
    question: 'Posso cancelar a qualquer momento?',
    answer:
      'Sim, você pode cancelar sua assinatura quando quiser, sem taxas ou burocracias. Basta acessar as configurações da sua conta. Após o cancelamento, você ainda terá acesso até o fim do período pago.',
  },
  {
    question: 'O que são as Trajetórias?',
    answer:
      'Trajetórias são jornadas temáticas de 21 dias, projetadas por especialistas para ajudar você a alcançar objetivos específicos como "Controle da Ansiedade", "Sono Reparador" ou "Foco e Produtividade". Cada dia inclui uma prática de meditação, exercício de respiração e reflexão guiada.',
  },
  {
    question: 'Funciona offline?',
    answer:
      'Sim! Com o plano anual, você pode baixar meditações e praticar mesmo sem conexão com a internet. Perfeito para momentos de viagem ou quando você precisa de paz longe das distrações digitais.',
  },
  {
    question: 'Como funciona o período de teste?',
    answer:
      'Você tem 7 dias grátis para experimentar todos os recursos do ETHRA. Durante esse período, você terá acesso completo às meditações, trajetórias e ferramentas de respiração. Sem compromisso - cancele antes do fim do teste e não será cobrado.',
  },
];

export const FAQSection: React.FC = () => {
  return (
    <section className="py-20 px-5 bg-gradient-to-b from-landing-lavender/20 to-landing-bg">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-landing-sage/20 text-landing-text/70 text-sm font-medium mb-4">
            Dúvidas
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-landing-text mb-4">
            Perguntas Frequentes
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-2xl border border-landing-lavender/30 px-6 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <AccordionTrigger className="text-left text-landing-text font-semibold py-5 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-landing-text/70 pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
