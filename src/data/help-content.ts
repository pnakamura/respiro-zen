export interface HelpContent {
  title: string;
  description: string;
  example?: string;
  tip?: string;
}

export const helpContent: Record<string, HelpContent> = {
  // Home/Dashboard
  'garden-widget': {
    title: 'Seu Jardim Interior',
    description: 'Seu jardim cresce com sua prática diária! Cada dia que você faz check-in de humor, respira ou medita, sua planta evolui para o próximo estágio.',
    example: '🌱 → 🌿 → 🌷 → 🌻 → 🌳 → 🏯',
    tip: 'Mantenha sua sequência ativa para ver criaturas especiais aparecerem no seu jardim!'
  },
  'level-points': {
    title: 'Nível e Pontos',
    description: 'Ganhe pontos completando atividades e desbloqueie novos estágios do seu jardim interior. A cada 100 pontos, você sobe de nível!',
    tip: 'Check-ins de humor, sessões de respiração e meditações rendem mais pontos.'
  },
  'quick-actions': {
    title: 'Ações Rápidas',
    description: 'Acesso direto às principais práticas de bem-estar. Toque em qualquer card para começar uma atividade.',
    tip: 'Experimente todas as práticas para descobrir qual funciona melhor para você.'
  },
  'daily-guidance': {
    title: 'Orientação Diária',
    description: 'Seu guia espiritual personalizado está disponível 24/7 para conversas de apoio emocional e orientação.',
    tip: 'Quanto mais você conversa, mais o guia entende suas necessidades.'
  },

  // Mood Check
  'emotion-wheel': {
    title: 'Roda de Emoções',
    description: 'Baseada na teoria de Robert Plutchik, a roda contém 8 emoções primárias. Selecione até 3 emoções que representam como você se sente agora.',
    example: 'Se está ansioso antes de uma reunião, pode selecionar "Medo" + "Antecipação".',
    tip: 'Não existe resposta errada! Suas emoções são válidas.'
  },
  'emotion-intensity': {
    title: 'Intensidade da Emoção',
    description: 'Use o slider para indicar a força dessa emoção, de leve (1) a intensa (5).',
    example: 'Uma leve irritação seria 1-2, enquanto raiva intensa seria 4-5.',
    tip: 'Perceber a intensidade ajuda a entender seus padrões emocionais.'
  },

  // Breathing
  'breath-cycles': {
    title: 'Ciclos de Respiração',
    description: 'Número de repetições do padrão de respiração. Mais ciclos significam uma sessão mais longa e profunda.',
    example: '5 ciclos ≈ 2-3 minutos, 10 ciclos ≈ 5-6 minutos.',
    tip: 'Comece com poucos ciclos e aumente gradualmente conforme se sentir confortável.'
  },
  'breath-pattern': {
    title: 'Padrão de Respiração',
    description: 'Cada técnica tem um ritmo próprio definindo os tempos de inspirar, segurar e expirar. Siga o círculo animado!',
    tip: 'Se sentir tontura, pause e respire normalmente por alguns momentos.'
  },
  'breath-technique': {
    title: 'Técnica de Respiração',
    description: 'Diferentes técnicas produzem diferentes efeitos. Escolha baseado no que você precisa agora.',
    example: 'Respiração 4-7-8 para relaxar, Respiração de Fogo para energizar.',
    tip: 'O app recomenda técnicas baseadas no seu estado emocional atual.'
  },

  // Journal
  'journal-entry': {
    title: 'Entrada de Diário',
    description: 'Escreva livremente sobre seu dia, pensamentos, reflexões ou qualquer coisa que precise expressar. Este é seu espaço seguro e privado.',
    tip: 'Escrever regularmente ajuda a processar emoções e identificar padrões.'
  },

  // Nutrition
  'meal-checkin': {
    title: 'Check-in de Refeição',
    description: 'Antes de comer, pause e identifique: é fome física (sensação no estômago) ou emocional (mente buscando conforto)?',
    example: 'Fome física: crescente e paciente. Fome emocional: súbita e urgente.',
    tip: 'Se for fome emocional, experimente uma respiração curta antes de decidir comer.'
  },
  'water-tracker': {
    title: 'Hidratação',
    description: 'Registre cada copo de água consumido. A meta recomendada é 8 copos (2 litros) por dia.',
    tip: 'Mantenha uma garrafa de água visível para lembrar de beber regularmente.'
  },
  'mindful-eating': {
    title: 'Alimentação Consciente',
    description: 'Conecte sua alimentação ao seu estado emocional. Perceba como diferentes alimentos afetam seu humor e energia.',
    tip: 'Coma devagar e sem distrações para maior consciência.'
  },

  // Insights
  'wellness-score': {
    title: 'Score de Bem-estar',
    description: 'Pontuação calculada com base em suas emoções registradas, práticas completadas e consistência. Varia de 0 a 100.',
    example: 'Score 75+ indica equilíbrio emocional consistente.',
    tip: 'O score é uma referência, não um julgamento. Flutuações são normais!'
  },
  'emotion-radar': {
    title: 'Radar de Emoções',
    description: 'Gráfico que mostra a frequência de cada uma das 8 emoções primárias no período selecionado.',
    tip: 'Use para identificar quais emoções são mais presentes na sua vida.'
  },
  'dyad-timeline': {
    title: 'Linha do Tempo de Díades',
    description: 'Díades são combinações de emoções primárias que formam emoções secundárias, como "Medo + Tristeza = Desespero".',
    tip: 'Reconhecer díades ajuda a entender emoções complexas.'
  },
  'weekly-summary': {
    title: 'Resumo Semanal',
    description: 'Visão geral das suas práticas e emoções dos últimos 7 dias com comparação ao período anterior.',
    tip: 'Revise semanalmente para acompanhar seu progresso.'
  },

  // Journeys
  'journeys-how-it-works': {
    title: 'Como Funcionam as Jornadas',
    description: 'Jornadas são trilhas de transformação pessoal com duração de vários dias. Cada dia traz um ensinamento, práticas sugeridas (respiração ou meditação) e um desafio opcional.',
    example: 'MBSR (21 dias): baseado no protocolo de Mindfulness para redução de estresse.',
    tip: 'Complete um dia por vez. Não pule dias — cada ensinamento prepara você para o próximo.'
  },
  'journey-progress': {
    title: 'Seu Progresso',
    description: 'O grid mostra todos os dias da jornada. Dias concluídos ficam marcados (✓), o dia atual pulsa suavemente (▶), e dias futuros estão bloqueados (🔒).',
    example: 'Toque no dia atual para abrir o conteúdo e começar a prática.',
    tip: 'Você pode revisitar dias anteriores tocando neles a qualquer momento.'
  },
  'journey-day': {
    title: 'Conteúdo do Dia',
    description: 'Cada dia da jornada inclui ensinamentos, práticas sugeridas e desafios opcionais para aprofundar sua experiência.',
    tip: 'Leia o ensinamento com calma antes de fazer as práticas.'
  },

  // Profile
  'streak-info': {
    title: 'Sequência de Dias',
    description: 'Número de dias consecutivos que você praticou alguma atividade no app. Manter a sequência ajuda a criar hábitos.',
    tip: 'Mesmo 1 minuto de respiração conta para manter sua sequência!'
  }
};
