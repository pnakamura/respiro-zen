import { motion } from 'framer-motion';
import { ArrowLeft, Shield, FileText, Database, AlertTriangle, Scale, Clock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BottomNavigation } from '@/components/BottomNavigation';

export default function Privacy() {
  const navigate = useNavigate();

  const sections = [
    {
      id: 'acceptance',
      icon: FileText,
      title: '1. Aceitação dos Termos',
      content: `Ao acessar ou utilizar o aplicativo ETHRA ("Aplicativo"), você concorda em estar vinculado a estes Termos de Uso e à nossa Política de Privacidade. Se você não concordar com qualquer parte destes termos, não deverá utilizar o Aplicativo.

O uso continuado do Aplicativo após quaisquer alterações nos termos constitui aceitação dessas alterações. Recomendamos que você revise periodicamente estes termos.

Você deve ter pelo menos 13 anos de idade para utilizar este Aplicativo. Ao usar o Aplicativo, você declara e garante que tem pelo menos 13 anos de idade.`
    },
    {
      id: 'service',
      icon: Shield,
      title: '2. Natureza do Serviço',
      content: `O ETHRA é um aplicativo de bem-estar e autoconhecimento emocional, projetado para auxiliar usuários em práticas de respiração, meditação, registro emocional e jornadas de desenvolvimento pessoal.

AVISO IMPORTANTE: Este Aplicativo NÃO é um serviço médico, psicológico ou terapêutico. O conteúdo fornecido é exclusivamente para fins educativos e de autoconhecimento. O Aplicativo NÃO fornece:
• Diagnósticos médicos ou psicológicos
• Tratamento de condições de saúde mental
• Substituição a aconselhamento profissional
• Atendimento de emergência

Se você estiver enfrentando uma crise de saúde mental, pensamentos suicidas ou qualquer emergência médica, procure imediatamente um profissional de saúde qualificado ou ligue para os serviços de emergência (SAMU 192 ou CVV 188).`
    },
    {
      id: 'data',
      icon: Database,
      title: '3. Coleta e Uso de Dados',
      content: `Coletamos e processamos as seguintes informações:
• Dados de registro emocional que você insere voluntariamente
• Informações de uso do Aplicativo (frequência, preferências)
• Dados de sessões de respiração e meditação
• Entradas de diário e reflexões pessoais

Seus dados são:
• Armazenados de forma segura utilizando criptografia padrão da indústria
• Acessíveis apenas por você através de sua conta autenticada
• NUNCA vendidos ou compartilhados com terceiros para fins comerciais
• Utilizados apenas para melhorar sua experiência no Aplicativo

Podemos usar dados anonimizados e agregados para análise e melhoria do serviço, sem identificar usuários individuais.`
    },
    {
      id: 'liability',
      icon: AlertTriangle,
      title: '4. Limitação de Responsabilidade',
      content: `EM NENHUMA CIRCUNSTÂNCIA OS DESENVOLVEDORES, PROPRIETÁRIOS, AFILIADOS OU LICENCIADORES DO ETHRA SERÃO RESPONSÁVEIS POR:

a) Quaisquer danos diretos, indiretos, incidentais, especiais, consequenciais ou punitivos decorrentes do uso ou incapacidade de uso do Aplicativo;

b) Quaisquer decisões ou ações tomadas por você com base nas informações fornecidas pelo Aplicativo;

c) Qualquer interpretação de estados emocionais ou recomendações fornecidas pelo Aplicativo;

d) Perda de dados, interrupção de serviço ou falhas técnicas;

e) Ações ou omissões de terceiros relacionadas ao uso do Aplicativo.

O APLICATIVO É FORNECIDO "COMO ESTÁ" E "CONFORME DISPONÍVEL", SEM GARANTIAS DE QUALQUER TIPO, EXPRESSAS OU IMPLÍCITAS.`
    },
    {
      id: 'disclaimer',
      icon: Scale,
      title: '5. Isenção de Garantias',
      content: `Não garantimos que:
• O Aplicativo será ininterrupto, oportuno, seguro ou livre de erros
• Os resultados obtidos através do uso do Aplicativo serão precisos ou confiáveis
• A qualidade de qualquer informação obtida através do Aplicativo atenderá às suas expectativas
• Quaisquer erros no Aplicativo serão corrigidos

Você compreende e concorda que qualquer material baixado ou obtido através do uso do Aplicativo é feito por sua própria conta e risco, e você será o único responsável por qualquer dano ao seu dispositivo ou perda de dados.`
    },
    {
      id: 'content',
      icon: FileText,
      title: '6. Conteúdo do Usuário',
      content: `Você mantém todos os direitos de propriedade sobre o conteúdo que insere no Aplicativo (entradas de diário, reflexões, etc.). Ao usar o Aplicativo, você nos concede uma licença limitada para:

• Armazenar e processar seu conteúdo para fornecer os serviços do Aplicativo
• Usar dados anonimizados para melhorar o Aplicativo
• Gerar insights personalizados baseados em seu uso

Você concorda em não inserir conteúdo que:
• Seja ilegal, prejudicial ou ofensivo
• Viole direitos de terceiros
• Contenha vírus ou código malicioso`
    },
    {
      id: 'availability',
      icon: Clock,
      title: '7. Disponibilidade do Serviço',
      content: `Nos reservamos o direito de:
• Modificar, suspender ou descontinuar o Aplicativo a qualquer momento
• Limitar o acesso a certas funcionalidades
• Atualizar estes termos periodicamente

Não garantimos disponibilidade contínua ou ininterrupta do serviço. Manutenções programadas ou de emergência podem causar interrupções temporárias.

Em caso de descontinuação do serviço, faremos esforços razoáveis para notificar os usuários com antecedência e fornecer meios para exportar seus dados pessoais.`
    },
    {
      id: 'modifications',
      icon: FileText,
      title: '8. Modificações nos Termos',
      content: `Podemos atualizar estes Termos de Uso periodicamente. Quando fizermos alterações significativas, você será notificado através do Aplicativo ou por e-mail.

O uso continuado do Aplicativo após a publicação de alterações constitui aceitação dos novos termos. Se você não concordar com os termos modificados, deve deixar de usar o Aplicativo.

Recomendamos verificar esta página periodicamente para estar ciente de quaisquer alterações.`
    },
    {
      id: 'contact',
      icon: Mail,
      title: '9. Contato',
      content: `Para questões sobre estes Termos de Uso ou sobre o Aplicativo, entre em contato conosco:

• E-mail: suporte@ethra.app
• Através do próprio Aplicativo, na seção de ajuda

Responderemos às suas consultas no menor tempo possível.

Lei Aplicável: Estes termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será resolvida nos tribunais competentes do Brasil.`
    }
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col pb-28 bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-8 px-6 pb-6"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors dark:border-glow"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground dark:text-glow">
              Privacidade & Termos
            </h1>
            <p className="text-sm text-muted-foreground">
              Última atualização: Janeiro 2026
            </p>
          </div>
        </div>
      </motion.header>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-6 mb-6"
      >
        <div className="card-elevated p-4 border border-primary/20 dark:border-glow dark:card-glow">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 dark:animate-glow-pulse">
              <Shield className="w-5 h-5 text-primary dark:icon-glow" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground dark:text-glow">
                Seu bem-estar é nossa prioridade
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Estes termos existem para proteger você e garantir uma experiência segura. 
                Por favor, leia com atenção.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="flex-1 px-6 space-y-4">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.section
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <div className="card-elevated overflow-hidden dark:card-glow dark:border-glow">
                <div className="p-4 border-b border-border/50 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary dark:icon-glow" />
                    </div>
                    <h3 className="font-semibold text-foreground dark:text-glow">
                      {section.title}
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.section>
          );
        })}

        {/* Final Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-destructive text-sm">
                Aviso Legal Importante
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Este aplicativo não substitui tratamento médico ou psicológico profissional. 
                Se você estiver em crise, procure ajuda profissional imediatamente. 
                CVV: 188 (24 horas) | SAMU: 192
              </p>
            </div>
          </div>
        </motion.div>

        {/* Acceptance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center py-6"
        >
          <p className="text-xs text-muted-foreground">
            Ao continuar usando o ETHRA, você confirma que leu, entendeu e 
            concorda com estes Termos de Uso e Política de Privacidade.
          </p>
        </motion.div>
      </main>

      <BottomNavigation />
    </div>
  );
}
