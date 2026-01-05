-- =====================================================
-- JORNADA 1: Cultivando a Gratidão (14 dias)
-- =====================================================
INSERT INTO public.journeys (
  title, subtitle, description, icon, duration_days, difficulty, 
  category, theme_color, benefits, display_order, is_active, is_premium
) VALUES (
  'Cultivando a Gratidão',
  'Transforme sua perspectiva em 14 dias',
  'Uma jornada de 14 dias para desenvolver o hábito transformador da gratidão. Aprenda a reconhecer as bênçãos diárias, reescrever narrativas negativas e cultivar uma perspectiva mais positiva e abundante da vida.',
  '🙏',
  14,
  'iniciante',
  'gratidão',
  'amber',
  '["Aumento dos níveis de felicidade", "Redução de pensamentos negativos", "Melhora nos relacionamentos", "Maior resiliência emocional", "Sono mais tranquilo"]'::jsonb,
  4,
  true,
  false
);

-- =====================================================
-- JORNADA 2: Noites Serenas (7 dias)
-- =====================================================
INSERT INTO public.journeys (
  title, subtitle, description, icon, duration_days, difficulty, 
  category, theme_color, benefits, display_order, is_active, is_premium
) VALUES (
  'Noites Serenas',
  'Transforme suas noites em 7 dias',
  'Uma semana dedicada a transformar sua relação com o sono. Descubra rituais noturnos, técnicas de relaxamento profundo e práticas para acalmar a mente antes de dormir, garantindo noites mais restauradoras.',
  '🌙',
  7,
  'iniciante',
  'sono',
  'indigo',
  '["Adormecer mais facilmente", "Sono mais profundo e restaurador", "Redução da ansiedade noturna", "Despertar mais energizado", "Melhora do humor diurno"]'::jsonb,
  5,
  true,
  false
);

-- =====================================================
-- JORNADA 3: Autocompaixão em Prática (10 dias)
-- =====================================================
INSERT INTO public.journeys (
  title, subtitle, description, icon, duration_days, difficulty, 
  category, theme_color, benefits, display_order, is_active, is_premium
) VALUES (
  'Autocompaixão em Prática',
  'Gentileza consigo mesmo em 10 dias',
  'Aprenda a tratar a si mesmo com a mesma gentileza que ofereceria a um amigo querido. Esta jornada de 10 dias explora as três dimensões da autocompaixão: bondade consigo, humanidade compartilhada e atenção plena.',
  '💝',
  10,
  'intermediário',
  'autocuidado',
  'rose',
  '["Redução da autocrítica destrutiva", "Maior resiliência emocional", "Melhor gestão de erros e falhas", "Aumento da autoestima saudável", "Relacionamentos mais equilibrados"]'::jsonb,
  6,
  true,
  false
);

-- =====================================================
-- JORNADA 4: Breathwork - O Poder da Respiração (5 dias)
-- =====================================================
INSERT INTO public.journeys (
  title, subtitle, description, icon, duration_days, difficulty, 
  category, theme_color, benefits, display_order, is_active, is_premium
) VALUES (
  'Breathwork: O Poder da Respiração',
  'Domine sua respiração em 5 dias',
  'Descubra como a respiração consciente pode transformar seu estado mental e emocional. Nesta jornada intensiva de 5 dias, você aprenderá técnicas práticas para reduzir estresse, aumentar energia e encontrar clareza mental.',
  '🌬️',
  5,
  'iniciante',
  'respiração',
  'cyan',
  '["Redução imediata do estresse", "Maior clareza mental", "Controle da ansiedade", "Aumento de energia quando necessário", "Melhor qualidade de sono"]'::jsonb,
  7,
  true,
  false
);

-- =====================================================
-- DIAS DA JORNADA: Cultivando a Gratidão (14 dias)
-- =====================================================

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 1, 'O Poder da Gratidão',
'A gratidão é uma das emoções mais transformadoras que podemos cultivar. Pesquisas científicas demonstram que pessoas que praticam gratidão regularmente experimentam níveis mais elevados de bem-estar, dormem melhor, expressam mais compaixão e têm sistemas imunológicos mais fortes.

O Dr. Robert Emmons, principal pesquisador mundial sobre gratidão, descobriu que manter um diário de gratidão por apenas três semanas resulta em melhorias significativas no humor e satisfação com a vida. A gratidão literalmente reconecta nosso cérebro para focar no positivo.

Gratidão não é negar as dificuldades ou fingir que tudo está bem. É a capacidade de reconhecer que, mesmo em meio aos desafios, existem bênçãos presentes. É uma escolha consciente de mudar o foco da escassez para a abundância.

Hoje, começamos uma jornada que pode transformar profundamente sua experiência de vida. Não se trata de grandes gestos, mas de pequenas práticas diárias que, com o tempo, criam uma nova lente através da qual você vê o mundo.',
'Quando foi a última vez que você sentiu gratidão profunda? O que provocou esse sentimento?',
'Três Bênçãos',
'Antes de dormir, escreva três coisas boas que aconteceram hoje, por menores que sejam. Para cada uma, responda: "Por que isso aconteceu?" Esta prática simples é uma das mais estudadas e eficazes para aumentar o bem-estar.',
'mental'
FROM public.journeys j WHERE j.title = 'Cultivando a Gratidão';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 2, 'Olhos Novos para o Cotidiano',
'Vivemos no piloto automático. Tomamos o mesmo café, percorremos o mesmo caminho, vemos as mesmas pessoas - e deixamos de realmente perceber. A familiaridade, paradoxalmente, nos cega para as bênçãos que nos cercam.

Imagine que você é um visitante vendo sua vida pela primeira vez. O que notaria? A água quente do chuveiro. O sol entrando pela janela. O abraço de alguém querido. Esses "milagres ordinários" estão por toda parte, esperando ser redescobertos.

O filósofo G.K. Chesterton escreveu: "O mundo nunca está sem maravilhas, apenas às vezes estamos sem admiração." Cultivar gratidão é reconquistar essa capacidade de admiração.

Hoje, pratique o "olhar de iniciante". Observe seu ambiente como se fosse a primeira vez. Note texturas, sons, cheiros. Perceba as pessoas ao seu redor.',
'Quais aspectos da sua rotina diária você deixou de apreciar por serem tão familiares?',
'O Olhar de Iniciante',
'Escolha uma atividade rotineira (tomar café, caminhar até o trabalho, uma refeição) e faça-a hoje com atenção total, como se fosse a primeira vez. Note pelo menos 5 detalhes que normalmente passam despercebidos.',
'mental'
FROM public.journeys j WHERE j.title = 'Cultivando a Gratidão';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 3, 'Gratidão pelo Corpo',
'Nosso corpo trabalha incansavelmente por nós, e raramente paramos para agradecer. O coração bate mais de 100.000 vezes por dia. Os pulmões processam cerca de 20.000 respirações. Cada célula trabalha em harmonia para nos manter vivos.

Frequentemente, só notamos o corpo quando algo dói ou não funciona bem. Essa atenção seletiva ao negativo nos rouba a oportunidade de apreciar o milagre que é estar vivo, respirando, existindo.

Gratidão pelo corpo não significa ignorar limitações ou problemas de saúde. Significa reconhecer tudo que funciona, tudo que o corpo faz por você a cada momento.

Quando agradecemos ao corpo, criamos uma relação mais amorosa com ele. Pesquisas mostram que pessoas que praticam gratidão corporal tendem a cuidar melhor de si mesmas.',
'Como é sua relação com seu corpo? Você tende a criticá-lo ou apreciá-lo?',
'Carta de Gratidão ao Corpo',
'Faça um escaneamento corporal lento, da cabeça aos pés. Para cada parte do corpo, agradeça silenciosamente pelo que ela faz por você. Ao final, escreva uma breve carta de gratidão ao seu corpo.',
'physical'
FROM public.journeys j WHERE j.title = 'Cultivando a Gratidão';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 4, 'Cartas de Agradecimento',
'Uma das práticas de gratidão mais poderosas é expressar agradecimento diretamente a outra pessoa. Martin Seligman, pai da psicologia positiva, desenvolveu o exercício da "Visita de Gratidão" - escrever e entregar pessoalmente uma carta de agradecimento.

Os resultados são extraordinários: quem pratica este exercício experimenta aumentos significativos de felicidade que duram semanas. O ato de articular nossa gratidão a aprofunda, e compartilhá-la fortalece nossos vínculos.

Muitas vezes, as pessoas que mais nos ajudaram nunca souberam o impacto que tiveram. Talvez um professor, um amigo, um familiar.

Hoje, você tem a oportunidade de mudar isso. De dizer "obrigado" de forma profunda e significativa.',
'Quem na sua vida merece um agradecimento que você nunca expressou adequadamente?',
'Carta de Gratidão Sincera',
'Escreva uma carta de gratidão genuína para alguém que fez diferença positiva em sua vida. Seja específico sobre o que a pessoa fez e como isso afetou você. Se possível, entregue ou leia a carta pessoalmente.',
'social'
FROM public.journeys j WHERE j.title = 'Cultivando a Gratidão';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 5, 'Transformando Desafios',
'A gratidão mais profunda não ignora as dificuldades - ela encontra significado nelas. Isso não significa ser grato pelos eventos difíceis em si, mas pela força, sabedoria ou crescimento que emergiram deles.

Toda crise carrega em si as sementes de uma oportunidade. Toda dor pode ser professora. Toda perda pode revelar o que realmente importa.

Viktor Frankl, sobrevivente do Holocausto, escreveu: "Em algum momento, a vida faz uma pergunta a cada pessoa - e ela só pode responder através da própria vida."

Isso não acontece imediatamente. Algumas feridas precisam de tempo para cicatrizar. Mas com distância e reflexão, podemos frequentemente ver como os momentos mais difíceis nos moldaram.',
'Qual desafio passado você agora pode ver sob uma luz diferente? Que lições ou forças ele trouxe?',
'Reescrevendo a Narrativa',
'Escolha uma dificuldade do passado. Escreva a história dessa dificuldade, mas focando em: O que você aprendeu? Como cresceu? Que forças descobriu em si?',
'mental'
FROM public.journeys j WHERE j.title = 'Cultivando a Gratidão';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 6, 'A Natureza como Presente',
'A natureza é uma fonte inesgotável de maravilhamento e gratidão. O nascer do sol que acontece fielmente a cada dia. A complexidade impossível de uma flor. O ritmo das estações.

Estudos mostram que passar tempo na natureza reduz o cortisol, melhora o humor e aumenta sentimentos de admiração e conexão. A natureza nos lembra que somos parte de algo muito maior.

Os japoneses têm uma prática chamada "Shinrin-yoku" ou "banho de floresta" - simplesmente estar presente na natureza, absorvendo-a com todos os sentidos.

Quando cultivamos gratidão pela natureza, desenvolvemos também um senso de responsabilidade. Queremos proteger aquilo que amamos.',
'Qual aspecto da natureza mais o maravilha? Quando foi a última vez que você parou para realmente apreciá-lo?',
'Comunhão com a Natureza',
'Passe pelo menos 20 minutos em contato com a natureza hoje - um parque, jardim, ou mesmo observando o céu. Deixe o celular de lado. Use todos os sentidos. Encontre três elementos naturais pelos quais você é genuinamente grato.',
'spiritual'
FROM public.journeys j WHERE j.title = 'Cultivando a Gratidão';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 7, 'Gratidão Silenciosa',
'Chegamos à metade da jornada, um momento para aprofundar nossa prática através do silêncio. A meditação de gratidão combina os benefícios da atenção plena com o poder transformador do agradecimento.

No silêncio, podemos ouvir mais claramente as bênçãos que o ruído do dia abafa. Podemos sentir mais profundamente a gratidão que as palavras às vezes limitam.

Thich Nhat Hanh ensinava uma meditação simples: "Inspirando, eu sei que estou vivo. Expirando, eu sorrio para a vida." Esta consciência básica de estar vivo é a gratidão mais fundamental.

Hoje, reserve um tempo para simplesmente estar. Sem agenda, sem lista. Apenas presença aberta, permitindo que a gratidão surja naturalmente do silêncio.',
'Você consegue ficar em silêncio sem se sentir desconfortável? O que o silêncio revela para você?',
'Meditação de Gratidão',
'Pratique 10-15 minutos de meditação silenciosa focada em gratidão. Sente-se confortavelmente, feche os olhos, respire suavemente. A cada inspiração, pense "recebendo". A cada expiração, pense "obrigado".',
'spiritual'
FROM public.journeys j WHERE j.title = 'Cultivando a Gratidão';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 8, 'Reconhecendo Pequenas Alegrias',
'A felicidade não vive apenas nos grandes momentos - ela se esconde nas pequenas alegrias do cotidiano. O aroma do café pela manhã. O som da chuva na janela. Uma risada inesperada.

Barbara Fredrickson, pesquisadora de emoções positivas, descobriu que não é a intensidade das emoções positivas que importa, mas a frequência. Muitos pequenos momentos de alegria contribuem mais para o bem-estar que raros momentos de êxtase.

Quando começamos a notar e apreciar essas micro-alegrias, elas parecem se multiplicar. Na verdade, elas sempre estiveram lá - nós é que estávamos olhando para outro lugar.

Hoje, ative seu "radar de alegria". Torne-se um caçador de momentos bons.',
'Quais são as pequenas alegrias do seu dia que você raramente nota ou aprecia?',
'Caçador de Alegrias',
'Hoje, mantenha um registro de cada pequena alegria que notar ao longo do dia. Objetivo: encontrar pelo menos 10. À noite, reveja sua "coleção" e saboreie cada uma.',
'creative'
FROM public.journeys j WHERE j.title = 'Cultivando a Gratidão';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 9, 'Agradecer a Si Mesmo',
'Somos frequentemente nossos críticos mais severos. Notamos cada falha, cada erro, cada imperfeição. Mas raramente paramos para agradecer a nós mesmos - por nossos esforços, nossa persistência, nosso crescimento.

Autoagradecimento não é arrogância ou narcisismo. É reconhecimento justo do que você faz, do que supera, do quanto tenta.

Pense em tudo que você já atravessou. Nos dias difíceis que enfrentou. Nas vezes que se levantou depois de cair. Nos esforços silenciosos que ninguém viu.

Você merece seu próprio reconhecimento. Não por ser perfeito, mas por ser humano, por tentar, por continuar.',
'Quando foi a última vez que você genuinamente se reconheceu por algo que fez? Por que é tão difícil se dar crédito?',
'Carta de Autoagradecimento',
'Escreva uma carta de agradecimento para si mesmo. Agradeça por qualidades específicas, por esforços que fez, por dificuldades que superou. Leia a carta em voz alta, olhando-se no espelho se possível.',
'mental'
FROM public.journeys j WHERE j.title = 'Cultivando a Gratidão';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 10, 'O Presente do Tempo',
'O tempo é nosso recurso mais precioso e finito. Quando alguém nos dá seu tempo, está nos dando uma parte insubstituível de sua vida.

Vivemos em uma era de distração constante. Estar verdadeiramente presente com alguém - sem celular, sem pressa, com atenção plena - tornou-se um ato revolucionário de amor.

Pense nas pessoas que dedicaram tempo a você. Pais que sacrificaram noites de sono. Professores que ficaram além do horário. Amigos que ouviram suas histórias repetidas.

Hoje, reflita sobre o tempo como moeda de amor. A quem você pode oferecer o presente da sua presença plena?',
'Quem na sua vida merece mais do seu tempo e atenção presente? O que tem impedido você de dar isso?',
'Tempo de Qualidade',
'Dedique pelo menos 30 minutos hoje para estar completamente presente com alguém que você ama. Sem celular, sem TV, sem distrações. Apenas presença, escuta, conexão.',
'social'
FROM public.journeys j WHERE j.title = 'Cultivando a Gratidão';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 11, 'Diário Visual de Gratidão',
'Até agora, exploramos a gratidão principalmente através de palavras e reflexões. Hoje, vamos engajar a criatividade visual. Imagens podem capturar e evocar emoções de formas que palavras às vezes não conseguem.

Um diário visual de gratidão é uma coleção de imagens que representam suas bênçãos. Pode ser fotografias que você tira, recortes, desenhos simples.

O ato de procurar ativamente coisas "fotografáveis" pela lente da gratidão muda como vemos o mundo. Começamos a enquadrar nossa experiência de forma diferente.

Esta prática também cria um recurso valioso: em dias difíceis, você pode folhear seu diário visual e ser lembrado de todas as bênçãos que já notou.',
'Você já tentou capturar gratidão visualmente? Que tipo de imagens vêm à mente quando pensa em suas bênçãos?',
'Collage de Gratidão',
'Crie uma página de diário visual ou collage de gratidão. Use fotos, recortes, desenhos. Inclua pelo menos 5 elementos visuais que representam coisas pelas quais você é grato.',
'creative'
FROM public.journeys j WHERE j.title = 'Cultivando a Gratidão';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 12, 'Gratidão pelos Obstáculos',
'Os estoicos praticavam o conceito de "amor fati" - amor ao destino. Não apenas aceitar o que acontece, mas amar tudo que a vida traz, incluindo as dificuldades. Isso é reconhecer que obstáculos são professores.

Toda resistência que você enfrentou fortaleceu você de alguma forma. Toda decepção ensinou algo. Todo "não" que recebeu abriu espaço para um "sim" diferente.

Marco Aurélio escreveu: "O impedimento à ação avança a ação. O que está no caminho torna-se o caminho."

Isso não significa buscar dificuldades ou romantizar o sofrimento. Significa que, quando as dificuldades chegam, podemos encontrar valor nelas.',
'Qual obstáculo recente você poderia reinterpretar como um professor ou presente disfarçado?',
'Alquimia de Obstáculos',
'Liste três obstáculos significativos que você enfrentou na vida. Para cada um, escreva: O que você aprendeu? Que força desenvolveu? Como isso o preparou para algo que veio depois?',
'mental'
FROM public.journeys j WHERE j.title = 'Cultivando a Gratidão';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 13, 'Compartilhando Gratidão',
'A gratidão expressa é mais poderosa que a gratidão apenas sentida. Quando compartilhamos nosso agradecimento, criamos um ciclo virtuoso: a pessoa que recebe se sente valorizada e mais propensa a expressar sua própria gratidão.

Estudos mostram que culturas com mais expressão de gratidão têm níveis mais altos de bem-estar coletivo. Equipes de trabalho onde a gratidão é expressa regularmente são mais produtivas.

Expressar gratidão também nos beneficia como doadores. O ato de articular nosso agradecimento nos força a ser específicos sobre o que valorizamos.

Hoje, saia de sua zona de conforto. Expresse gratidão abertamente. Diga "obrigado" com mais frequência e profundidade.',
'O que impede você de expressar gratidão mais abertamente? Vergonha? Medo? Hábito?',
'Embaixador da Gratidão',
'Hoje, expresse gratidão de forma aberta pelo menos 5 vezes. Seja específico e genuíno. Agradeça ao barista, ao colega, ao familiar. Vá além do "obrigado" automático.',
'social'
FROM public.journeys j WHERE j.title = 'Cultivando a Gratidão';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 14, 'Integrando a Prática',
'Chegamos ao último dia desta jornada, mas na verdade é um novo começo. Ao longo de duas semanas, você experimentou diversas práticas de gratidão. Agora é momento de refletir sobre o que mais ressoou.

A pesquisa é clara: os benefícios da gratidão vêm com a prática regular, não com exercícios ocasionais. Como um músculo, a gratidão precisa ser exercitada para se fortalecer.

Algumas pessoas se beneficiam de um diário noturno. Outras preferem uma meditação matinal. Não existe forma "correta" - existe a forma que funciona para você.

O convite agora é transformar a gratidão de uma prática de 14 dias em um modo de vida.',
'Qual prática de gratidão desta jornada mais ressoou com você? O que você quer levar adiante?',
'Meu Ritual de Gratidão',
'Crie seu ritual pessoal de gratidão para manter após esta jornada. Quando você vai praticar? Qual formato? Qual prática principal? Comprometa-se com as próximas 30 dias.',
'spiritual'
FROM public.journeys j WHERE j.title = 'Cultivando a Gratidão';

-- =====================================================
-- DIAS DA JORNADA: Noites Serenas (7 dias)
-- =====================================================

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 1, 'Preparando o Santuário do Sono',
'Seu ambiente de sono comunica mensagens poderosas ao seu cérebro. Um quarto desorganizado, iluminado ou cheio de distrações sinaliza atividade e alerta. Um espaço escuro, fresco e tranquilo diz: é hora de descansar.

A ciência do sono nos ensina que nosso cérebro é extremamente sensível a estímulos ambientais. A luz azul de telas suprime a melatonina. Temperaturas elevadas dificultam o adormecer.

Seu quarto deve ser um santuário dedicado ao sono. Trabalho, preocupações e telas devem ficar do lado de fora.

Esta não é uma questão de ter um quarto luxuoso, mas intencional. Pequenas mudanças podem transformar dramaticamente a qualidade do seu sono.',
'Como é seu ambiente de sono atualmente? O que ele comunica ao seu corpo: atividade ou descanso?',
'Transformação do Quarto',
'Avalie e otimize seu ambiente de sono. Checklist: 1) Bloqueie luz. 2) Ajuste temperatura (18-21°C ideal). 3) Remova ou esconda telas. 4) Elimine desordem visual. 5) Adicione elemento relaxante. Implemente pelo menos 3 mudanças hoje.',
'physical'
FROM public.journeys j WHERE j.title = 'Noites Serenas';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 2, 'A Arte de Desacelerar',
'Nossa cultura celebra a velocidade e produtividade. Corremos o dia todo e esperamos que nosso cérebro simplesmente "desligue" quando deitamos. Mas o sistema nervoso não funciona assim - ele precisa de uma transição gradual.

Pense em um carro em alta velocidade. Você não para instantaneamente - precisa desacelerar gradualmente. Da mesma forma, seu corpo precisa de uma "pista de desaceleração" antes do sono.

Os especialistas recomendam iniciar a desaceleração pelo menos uma hora antes de dormir. Isso significa reduzir estímulos, baixar a intensidade das atividades, diminuir luzes.

Criar este ritual de transição é um ato de autocuidado profundo.',
'Como é sua última hora antes de dormir atualmente? Ela prepara você para o sono ou mantém seu cérebro ativo?',
'Hora Dourada Noturna',
'Crie uma "hora dourada" de desaceleração antes de dormir. 1) Defina um horário de início fixo. 2) Desligue ou silencie dispositivos. 3) Diminua as luzes. 4) Escolha atividades calmas. Pratique esta transição intencional hoje à noite.',
'mental'
FROM public.journeys j WHERE j.title = 'Noites Serenas';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 3, 'Respiração para o Sono',
'A respiração é a ferramenta mais poderosa e subutilizada para induzir o relaxamento. Diferente de outras funções automáticas, podemos controlar conscientemente nossa respiração - e através dela, acalmar todo o sistema nervoso.

A técnica 4-7-8, desenvolvida pelo Dr. Andrew Weil, é particularmente eficaz para o sono. Ela ativa o sistema nervoso parassimpático e desativa o simpático.

O padrão é simples: inspire pelo nariz contando 4, segure contando 7, expire pela boca contando 8. A expiração prolongada é a chave.

Muitas pessoas relatam que esta técnica os ajuda a adormecer em minutos.',
'Você já tentou usar a respiração para relaxar? Como você normalmente lida com a dificuldade de adormecer?',
'Técnica 4-7-8',
'Pratique a técnica 4-7-8 esta noite, já deitado na cama: 1) Expire completamente pela boca. 2) Inspire pelo nariz contando 4. 3) Segure contando 7. 4) Expire pela boca contando 8. 5) Repita pelo menos 4 ciclos.',
'physical'
FROM public.journeys j WHERE j.title = 'Noites Serenas';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 4, 'Liberando as Preocupações',
'Uma das maiores inimigas do sono é a mente ocupada. Deitamos e, de repente, todos os problemas não resolvidos começam a girar em nossa cabeça. É como se a quietude do quarto amplificasse o ruído mental.

A solução não é tentar forçar os pensamentos a parar. Em vez disso, precisamos de um processo de "descarregamento" antes de dormir.

O journaling noturno é uma ferramenta poderosa. Ao escrever suas preocupações, você as externaliza. Elas saem da sua cabeça e vão para o papel.

Outra técnica é a "lista de amanhã": escrever as tarefas do dia seguinte. Isso diz ao cérebro: "está registrado, você pode relaxar."',
'O que geralmente ocupa sua mente quando você tenta dormir? Preocupações, planejamentos, ruminações?',
'Ritual de Descarregamento',
'Crie um ritual de descarregamento mental: 1) Pegue um caderno dedicado. 2) Escreva livremente sobre o dia. 3) Liste 3 preocupações e escreva "amanhã cuido disso". 4) Feche o caderno como símbolo de fechar o dia. 5) Respire fundo e vá para cama.',
'mental'
FROM public.journeys j WHERE j.title = 'Noites Serenas';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 5, 'Relaxamento Muscular Progressivo',
'Muitas vezes não percebemos quanta tensão acumulamos no corpo ao longo do dia. Ombros elevados, mandíbula cerrada, testa franzida - essas tensões persistem mesmo quando deitamos.

O Relaxamento Muscular Progressivo (RMP), desenvolvido pelo Dr. Edmund Jacobson, é uma técnica simples e profundamente eficaz. Você tensiona deliberadamente grupos musculares e depois os relaxa.

O processo ensina seu corpo a reconhecer e liberar tensão. Com prática, você pode "escanear" seu corpo e soltar tensões que nem sabia que estava carregando.

O RMP é particularmente útil para pessoas que carregam estresse no corpo.',
'Onde você costuma carregar tensão no corpo? Você consegue perceber essa tensão quando deita para dormir?',
'Body Scan Progressivo',
'Pratique o Relaxamento Muscular Progressivo deitado: 1) Comece pelos pés - tensione por 5 segundos, relaxe por 30. 2) Suba para panturrilhas, coxas, glúteos, abdômen, mãos, braços, ombros, face. 3) Para cada grupo: tensione inspirando, relaxe expirando. 4) Ao final, escaneie o corpo notando a diferença.',
'physical'
FROM public.journeys j WHERE j.title = 'Noites Serenas';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 6, 'Visualização do Sono Reparador',
'A visualização é uma ferramenta poderosa que usa a imaginação para criar estados internos. Atletas a usam para melhorar performance; terapeutas, para tratar ansiedade.

Quando você imagina vividamente uma cena relaxante, seu cérebro ativa as mesmas áreas que seriam ativadas se você estivesse realmente lá. Seu corpo responde com relaxamento real.

Lugares naturais funcionam particularmente bem: uma praia ao entardecer, uma floresta tranquila, um campo sob estrelas. Envolva todos os sentidos - o som das ondas, o cheiro da mata, a brisa no rosto.

Com prática, seu lugar de visualização torna-se um gatilho para relaxamento.',
'Qual seria seu lugar ideal de paz e descanso? Onde você se sente mais seguro e relaxado?',
'Seu Refúgio Interior',
'Crie e visite seu refúgio interior esta noite: 1) Deitado, feche os olhos e respire profundamente. 2) Imagine um lugar de paz. 3) Use todos os sentidos. 4) Caminhe mentalmente pelo espaço. 5) Encontre um lugar para se deitar nesta paisagem. 6) Deixe-se adormecer ali.',
'spiritual'
FROM public.journeys j WHERE j.title = 'Noites Serenas';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 7, 'Seu Ritual Noturno Personalizado',
'Ao longo desta semana, você experimentou diversas práticas: preparação do ambiente, desaceleração, respiração, journaling, relaxamento muscular e visualização. Agora é momento de criar seu ritual noturno personalizado.

Um ritual eficaz de sono não precisa ser longo ou complicado. O mais importante é a consistência - fazer a mesma sequência de ações todas as noites cria associações poderosas.

Seu ritual pode ser simples: diminuir luzes às 21h, escrever três linhas no diário, fazer 5 minutos de respiração 4-7-8, praticar uma visualização curta.

O sono de qualidade não é luxo - é fundamento de saúde física, mental e emocional.',
'Das práticas desta semana, quais tiveram mais impacto no seu sono? O que é realista manter a longo prazo?',
'Meu Ritual Noturno',
'Desenhe seu ritual noturno personalizado: 1) Escolha 3-4 práticas desta semana que funcionaram. 2) Organize-as em sequência lógica. 3) Defina horários aproximados. 4) Escreva o ritual e deixe visível. 5) Comprometa-se a praticá-lo por mais 21 noites.',
'creative'
FROM public.journeys j WHERE j.title = 'Noites Serenas';

-- =====================================================
-- DIAS DA JORNADA: Autocompaixão em Prática (10 dias)
-- =====================================================

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 1, 'Conhecendo a Autocompaixão',
'A Dra. Kristin Neff, pioneira na pesquisa sobre autocompaixão, define três componentes essenciais: bondade consigo mesmo em vez de autojulgamento; reconhecimento da humanidade compartilhada em vez de isolamento; e atenção plena em vez de identificação excessiva com pensamentos negativos.

Autocompaixão não é autocomiseração, não é autoindulgência, e não é autoestima. É simplesmente tratar-se com a mesma gentileza que você ofereceria a um bom amigo que está sofrendo.

Pesquisas mostram que pessoas autocompassivas são mais resilientes, menos ansiosas e deprimidas, mais motivadas a melhorar após erros.

A autocrítica severa que muitos aprenderam como "motivação" é, na verdade, contraproducente. A autocompaixão ativa o sistema de cuidado, criando segurança e abertura para o crescimento.',
'Como você tipicamente se trata quando falha ou enfrenta dificuldades? Você seria tão duro com um amigo?',
'O Teste do Amigo',
'Quando surgir um momento de autocrítica hoje, pause e faça o "teste do amigo": 1) O que você está dizendo a si mesmo? 2) O que diria a um amigo querido na mesma situação? 3) Note a diferença. 4) Experimente falar consigo como falaria com esse amigo.',
'mental'
FROM public.journeys j WHERE j.title = 'Autocompaixão em Prática';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 2, 'A Voz Interior Gentil',
'Todos temos um crítico interior - aquela voz que aponta nossas falhas, compara-nos aos outros, e prevê fracassos. Para muitos, este crítico é cruel de formas que nunca seríamos com outra pessoa.

Esta voz geralmente começou como uma tentativa de nos proteger ou nos motivar. Talvez tenha ecoado críticas de pais, professores ou colegas.

A boa notícia é que podemos desenvolver uma nova voz - uma voz de autocompaixão. Isso não significa silenciar completamente o crítico, mas responder a ele.

Desenvolver esta voz gentil é como fortalecer um músculo. No início, pode parecer artificial. Com prática, torna-se mais natural.',
'Como soa seu crítico interior? Que palavras e tom ele usa? De onde você acha que essa voz veio?',
'Carta do Eu Compassivo',
'Escreva uma carta para si mesmo a partir de uma perspectiva incondicionalmente amorosa - como um mentor sábio. 1) Reconheça uma dificuldade. 2) Valide seus sentimentos. 3) Ofereça encorajamento gentil. 4) Lembre de suas forças. 5) Leia a carta em voz alta para si mesmo.',
'mental'
FROM public.journeys j WHERE j.title = 'Autocompaixão em Prática';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 3, 'Abraçando a Imperfeição',
'A filosofia japonesa do wabi-sabi encontra beleza na imperfeição, impermanência e incompletude. Uma tigela com uma rachadura reparada com ouro (kintsugi) não é considerada danificada, mas transformada em algo mais belo.

Nossa cultura frequentemente nos ensina o oposto: esconder falhas, projetar perfeição, sentir vergonha de limitações. Este padrão é exaustivo e impossível de manter.

A autocompaixão nos convida a fazer as pazes com nossa imperfeição. Não desistir de crescer, mas reconhecer que ser imperfeito é parte da experiência humana.

Quando abraçamos nossa imperfeição, paradoxalmente nos tornamos mais livres para nos arriscar e crescer.',
'Qual imperfeição sua você tem mais dificuldade em aceitar? Como seria tratar essa limitação com mais gentileza?',
'Celebrando as Rachaduras',
'Identifique uma "imperfeição" sua que você geralmente esconde ou critica. 1) Escreva sobre como ela faz você se sentir. 2) Reescreva: o que ela revela sobre sua humanidade? O que ela te ensinou? 3) Escreva uma declaração de aceitação desta parte de você.',
'spiritual'
FROM public.journeys j WHERE j.title = 'Autocompaixão em Prática';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 4, 'Carta para Si Mesmo',
'Um dos exercícios mais poderosos de autocompaixão é escrever uma carta para si mesmo como se fosse um amigo amoroso e sábio. Este exercício externaliza a perspectiva compassiva.

Quando escrevemos para um amigo querido que está sofrendo, naturalmente usamos um tom diferente. Validamos os sentimentos sem julgamento. Oferecemos perspectiva sem minimizar.

Por que não nos oferecemos o mesmo? Muitas vezes, porque aprendemos que isso seria "se vitimizar". Mas pesquisas mostram o oposto: autocompaixão nos fortalece.

A carta que você escreverá hoje é um recurso que você pode revisitar sempre que precisar de conforto.',
'Se um amigo querido estivesse passando exatamente pelo que você está passando, o que você diria a ele?',
'Carta de um Amigo Amoroso',
'Pense em algo que está te causando sofrimento. Escreva uma carta para si mesmo a partir da perspectiva de um amigo infinitamente sábio e amoroso. A carta deve: 1) Reconhecer sua dor. 2) Lembrar que você não está sozinho. 3) Oferecer as palavras de que você precisa ouvir.',
'creative'
FROM public.journeys j WHERE j.title = 'Autocompaixão em Prática';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 5, 'Humanidade Compartilhada',
'Um dos aspectos mais curativos da autocompaixão é o reconhecimento da "humanidade compartilhada" - a compreensão de que o sofrimento e a imperfeição são experiências universais, não sinais de que há algo errado conosco.

Quando estamos sofrendo, tendemos a sentir que estamos sozinhos, isolados, diferentes de todos os outros. Esse isolamento intensifica o sofrimento.

A verdade é que todos enfrentam dificuldades, cometem erros, sentem-se inadequados às vezes. Aquela pessoa que parece perfeita? Ela também tem suas lutas ocultas.

Thich Nhat Hanh ensinava: "Eu sofro, portanto você é." Nossa dor nos conecta com todos os seres que já sofreram.',
'Quando você sofre, você tende a se sentir mais isolado ou mais conectado aos outros? Por quê?',
'Círculo de Humanidade',
'Escolha uma dificuldade que você está enfrentando. 1) Reconheça o sofrimento: "Isso é difícil." 2) Lembre da humanidade: Pense em quantas outras pessoas enfrentam dificuldades similares. 3) Imagine-se fazendo parte de um grande círculo de pessoas que entendem sua experiência. 4) Ofereça compaixão a si e a todos neste círculo.',
'social'
FROM public.journeys j WHERE j.title = 'Autocompaixão em Prática';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 6, 'Cuidando do Corpo com Amor',
'Autocompaixão não é apenas um exercício mental - ela também tem uma dimensão física. Assim como confortamos outros com toque e cuidado físico, podemos aprender a confortar nosso próprio corpo.

Quando estamos em sofrimento emocional, muitas vezes desconectamos do corpo ou até o maltratamos. A autocompaixão física é o oposto: tratar o corpo como tratamos alguém que amamos.

Pesquisas mostram que o toque compassivo - mesmo auto-administrado - libera oxitocina, reduz cortisol e acalma o sistema nervoso.

Cuidar do corpo com amor também significa descanso quando precisamos, movimento quando faz bem, alimentação que nutre.',
'Como você trata seu corpo quando está passando por momentos difíceis? Com cuidado extra ou com negligência?',
'Ritual de Autocuidado Físico',
'Crie um mini ritual de autocuidado físico compassivo: 1) Coloque a mão no coração e respire. 2) Diga mentalmente: "Que eu possa me sentir seguro. Que eu possa me sentir calmo." 3) Faça uma ação de autocuidado físico: um banho quente, uma caminhada gentil, uma refeição nutritiva.',
'physical'
FROM public.journeys j WHERE j.title = 'Autocompaixão em Prática';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 7, 'Acolhendo Emoções Difíceis',
'Quando emoções difíceis surgem - tristeza, raiva, medo, vergonha - nossa tendência é resistir, suprimir ou nos perdermos nelas. A autocompaixão oferece um caminho do meio: reconhecer e acolher as emoções sem ser engolido por elas.

A prática RAIN oferece um framework: Reconheça o que está sentindo. Aceite a emoção estar presente. Investigue com gentileza onde sente no corpo. Não se identifique - você não É a emoção.

Quando acolhemos emoções difíceis com compaixão, elas frequentemente diminuem em intensidade. Resistir alimenta a emoção; acolher permite que ela flua.

Isso não significa que emoções difíceis são agradáveis. Mas podemos aprender a estar com elas de forma mais gentil.',
'Como você tipicamente lida com emoções difíceis? Você tende a evitá-las, se perder nelas, ou acolhê-las?',
'Prática RAIN',
'Quando uma emoção difícil surgir, pratique RAIN: 1) Reconheça: "Estou sentindo [emoção]." 2) Aceite: Permita a emoção estar presente. 3) Investigue: Onde sente no corpo? 4) Não-identificação: "Eu não sou minha raiva. Isso está passando." Respire e ofereça gentileza a si mesmo.',
'mental'
FROM public.journeys j WHERE j.title = 'Autocompaixão em Prática';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 8, 'Perdoando-se',
'Carregamos arrependimentos. Erros passados que revisitamos repetidamente com dor e autocrítica. A culpa pode ser apropriada inicialmente - nos mostra que agimos contra nossos valores. Mas culpa crônica se torna tóxica.

Perdoar a si mesmo não significa aprovar o que fez ou negar o impacto. Significa reconhecer que você, como todos os humanos, é imperfeito; que você fez o melhor que podia com a consciência que tinha.

O autoperdão é um processo, não um evento. Pode precisar ser praticado repetidamente. Envolve luto - pelo ideal que você não alcançou.

Quando nos perdoamos, não estamos dizendo "não importa". Estamos dizendo "importa, e aprendi, e agora escolho viver diferente."',
'Há algo que você ainda não perdoou em si mesmo? O que seria necessário para começar o processo de autoperdão?',
'Ritual de Autoperdão',
'Escolha algo pelo qual você carrega culpa. 1) Escreva o que aconteceu. 2) Reconheça o impacto. 3) Pergunte: "O que eu sei hoje que não sabia então?" 4) Escreva o que aprendeu. 5) Diga em voz alta: "Eu me perdoo. Eu era humano, fazendo o melhor que podia. Aprendi e cresci."',
'spiritual'
FROM public.journeys j WHERE j.title = 'Autocompaixão em Prática';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 9, 'Celebrando Suas Qualidades',
'Autocompaixão inclui não apenas gentileza nos momentos difíceis, mas também reconhecimento honesto de nossas qualidades. Para muitos, é mais fácil listar defeitos que virtudes. Isso não é humildade - é uma visão distorcida.

Ver claramente nossas forças não é arrogância. É simplesmente precisão. Assim como você pode reconhecer limitações sem se depreciar, pode reconhecer qualidades sem se exaltar.

Quando ignoramos nossas qualidades, perdemos recursos internos importantes. Suas forças são ferramentas para navegar a vida.

Hoje, pratique a arte rara de reconhecer o que há de bom em você - simplesmente o que é verdadeiro.',
'Por que é difícil para você reconhecer e celebrar suas qualidades? De onde veio essa dificuldade?',
'Inventário de Forças',
'Crie um inventário honesto de suas qualidades: 1) Liste 10 forças, qualidades ou talentos seus. 2) Para cada uma, escreva um exemplo concreto. 3) Escolha 3 que você mais valoriza. 4) Leia a lista em voz alta, dizendo "Eu sou [qualidade]."',
'creative'
FROM public.journeys j WHERE j.title = 'Autocompaixão em Prática';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 10, 'Integrando a Autocompaixão',
'Chegamos ao fim desta jornada, mas ao início de uma nova forma de se relacionar consigo mesmo. A autocompaixão não é um destino, mas um caminho - algo que praticamos continuamente.

Os três componentes que exploramos - bondade consigo, humanidade compartilhada e atenção plena - trabalham juntos. A atenção plena nos ajuda a perceber quando estamos sofrendo. O reconhecimento da humanidade nos lembra que não estamos sozinhos.

Haverá recaídas. Haverá momentos em que o velho crítico interior voltará com força. Nesses momentos, a autocompaixão se aplica a si mesma: simplesmente reconheça, perdoe e retorne à prática.

A pergunta mais importante que você pode fazer a si mesmo é simples: "O que eu preciso agora?"',
'Como foi esta jornada para você? O que mais impactou sua relação consigo mesmo?',
'Compromisso Compassivo',
'Crie um compromisso consigo mesmo para integrar a autocompaixão: 1) Escolha uma prática desta jornada para manter diariamente. 2) Identifique um "gatilho" onde lembrará de praticar. 3) Escreva uma frase-mantra de autocompaixão. 4) Compartilhe seu compromisso com alguém de confiança.',
'mental'
FROM public.journeys j WHERE j.title = 'Autocompaixão em Prática';

-- =====================================================
-- DIAS DA JORNADA: Breathwork (5 dias)
-- =====================================================

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 1, 'A Ciência da Respiração',
'A respiração é a única função do sistema nervoso autônomo que podemos controlar voluntariamente. Esta característica única a torna uma ponte entre mente e corpo, entre consciente e inconsciente.

Quando você muda conscientemente seu padrão de respiração, você está literalmente alterando a química do seu cérebro e corpo. Respiração lenta e profunda ativa o nervo vago, diminui a frequência cardíaca, baixa a pressão arterial.

A maioria das pessoas respira de forma superficial, rápida e pelo peito. Este padrão, associado ao estresse crônico, mantém o corpo em estado constante de alerta.

Hoje, começamos pelo fundamento: a respiração diafragmática. Esta técnica simples será a base para tudo que aprenderemos nesta semana.',
'Como é sua respiração normal? Você respira mais pelo peito ou pela barriga? Rápido ou devagar?',
'Respiração Diafragmática',
'Pratique a respiração diafragmática por 5 minutos: 1) Deite-se com uma mão no peito e outra na barriga. 2) Inspire lentamente pelo nariz, deixando a barriga subir. 3) Expire suavemente, sentindo a barriga baixar. 4) Mantenha ritmo: 4 segundos inspirando, 6 segundos expirando. 5) Pratique 3 vezes hoje.',
'mental'
FROM public.journeys j WHERE j.title = 'Breathwork: O Poder da Respiração';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 2, 'Respiração para Calma',
'Quando o estresse ataca, nossa respiração naturalmente se torna rápida e superficial. Isso faz sentido evolutivamente - prepara o corpo para luta ou fuga. Mas na vida moderna, raramente precisamos fugir de predadores.

A chave para acalmar o sistema nervoso está na expiração. Enquanto a inspiração ativa o sistema simpático (alerta), a expiração ativa o parassimpático (relaxamento). Prolongar a expiração é o caminho mais rápido para a calma.

O Box Breathing (respiração quadrada), usado por Navy SEALs, é extraordinariamente eficaz: inspire 4 segundos, segure 4, expire 4, segure 4. A regularidade do padrão acalma a mente.

A técnica 4-7-8 é ainda mais poderosa: inspire 4, segure 7, expire 8. A longa expiração maximiza a ativação parassimpática.',
'Em que situações você mais sente necessidade de se acalmar rapidamente? Trabalho? Discussões? Ansiedade noturna?',
'Box Breathing para Estresse',
'Pratique as técnicas de respiração calmante: 1) Box Breathing: 4-4-4-4 (inspire 4s, segure 4s, expire 4s, segure 4s). Faça 5 ciclos. 2) Técnica 4-7-8: inspire 4s, segure 7s, expire 8s. Faça 4 ciclos. 3) Compare: qual você sentiu mais eficaz? Use a preferida quando sentir estresse hoje.',
'physical'
FROM public.journeys j WHERE j.title = 'Breathwork: O Poder da Respiração';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 3, 'Respiração Energizante',
'Assim como podemos usar a respiração para acalmar, podemos usá-la para energizar. Técnicas de respiração rápida e intensa ativam o sistema nervoso simpático, aumentam alerta e oxigenação.

A Respiração de Fogo (Kapalabhati), do yoga, consiste em expirações rápidas e vigorosas com inspirações passivas. Ela aquece o corpo, energiza a mente e clareia a névoa mental. É como um "reset" do sistema.

Importante: técnicas energizantes devem ser praticadas sentado ou deitado (nunca dirigindo ou na água), com estômago vazio, e evitadas antes de dormir.

Pessoas com condições cardíacas, pressão alta ou gravidez devem consultar um médico primeiro.',
'Em que momentos do dia você mais precisa de energia? Você costuma recorrer a café? Como se sentiria tendo uma alternativa natural?',
'Respiração Energizante',
'Pratique a respiração energizante (de manhã ou à tarde, nunca à noite): 1) Kapalabhati: Sente-se ereto. Expire vigorosamente pelo nariz contraindo o abdômen. Faça 30 expirações rápidas. Pause. Repita 3 rodadas. 2) Respire normalmente por 1 minuto. 3) Note a diferença na sua energia.',
'physical'
FROM public.journeys j WHERE j.title = 'Breathwork: O Poder da Respiração';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 4, 'Respiração para Emoções',
'A respiração não apenas afeta nossas emoções - ela é inseparável delas. Quando estamos ansiosos, respiramos rápido. Quando tristes, suspiramos. Quando com raiva, respiramos pesado. Esta conexão funciona nos dois sentidos.

Emoções reprimidas frequentemente se armazenam como padrões de tensão no corpo, especialmente no diafragma e na região do peito. Técnicas de breathwork mais profundas podem ajudar a acessar e liberar essas emoções.

A Respiração Conectada é uma técnica simples mas poderosa: inspirar e expirar de forma contínua, sem pausas, criando um círculo de respiração. Este padrão pode trazer à superfície emoções e memórias.

É importante criar um espaço seguro para esta prática. Emoções podem surgir - lágrimas, risadas, raiva. Tudo é bem-vindo.',
'Você sente que carrega emoções não processadas no corpo? Onde sente mais tensão quando está emocionalmente carregado?',
'Respiração Conectada',
'Pratique a respiração conectada para liberação emocional (num momento e lugar com privacidade): 1) Deite-se confortavelmente. 2) Respire apenas pelo nariz, sem pausas entre inspiração e expiração. 3) Inspire pelo abdômen, depois pelo peito. 4) Expire relaxadamente. 5) Continue por 10-15 minutos. 6) Se emoções surgirem, permita-as.',
'spiritual'
FROM public.journeys j WHERE j.title = 'Breathwork: O Poder da Respiração';

INSERT INTO public.journey_days (journey_id, day_number, title, teaching_text, reflection_prompt, challenge_title, challenge_description, activity_type) 
SELECT j.id, 5, 'Criando sua Prática Diária',
'Ao longo desta semana, você experimentou o poder transformador da respiração consciente. Aprendeu técnicas para acalmar, energizar e processar emoções. Agora é momento de integrar essas ferramentas em uma prática sustentável.

A respiração consciente não precisa ser uma sessão formal de 20 minutos. Pode ser 3 respirações profundas antes de uma reunião, 1 minuto de box breathing no trânsito (estacionado!), ou 5 minutos de respiração diafragmática ao acordar.

O segredo é a consistência e a intenção. Quando você traz consciência à respiração regularmente, você está treinando seu sistema nervoso a ser mais regulado.

Crie "gatilhos de respiração" - momentos do dia onde você automaticamente lembra de respirar conscientemente.',
'Das técnicas que aprendeu esta semana, qual ressoou mais com você? Em que momentos do seu dia você mais se beneficiaria de respiração consciente?',
'Meu Protocolo de Respiração',
'Crie seu protocolo pessoal de breathwork: 1) Manhã: Escolha uma técnica para começar o dia. 2) Estresse: Qual técnica usará quando ansiedade aparecer? 3) Energia: O que fará quando precisar de um boost? 4) Noite: Como usará a respiração para melhorar o sono? 5) Defina 3 "gatilhos de respiração" no seu dia.',
'creative'
FROM public.journeys j WHERE j.title = 'Breathwork: O Poder da Respiração';