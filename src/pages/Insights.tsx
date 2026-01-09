import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TrendingUp, Calendar, Sparkles, ChevronRight, AlertCircle, Lock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useInsightsData, Period } from '@/hooks/useInsightsData';
import { useDemoInsightsData } from '@/hooks/useDemoData';
import { EmptyInsightsState } from '@/components/insights/EmptyInsightsState';
import { DemoBanner } from '@/components/insights/DemoBanner';
import { InsightsStats } from '@/components/insights/InsightsStats';
import { WeeklySummaryCard } from '@/components/insights/WeeklySummaryCard';
import { EmotionRadarChart } from '@/components/insights/EmotionRadarChart';
import { DyadTimeline } from '@/components/insights/DyadTimeline';
import { Skeleton } from '@/components/ui/skeleton';
import { useCanAccess } from '@/hooks/useFeatureAccess';
import { UpgradeModal } from '@/components/access/UpgradeModal';

export default function Insights() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [period, setPeriod] = useState<Period>('7d');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const { accessLevel, isLoading: accessLoading } = useCanAccess('module_insights');
  const isDemoMode = searchParams.get('demo') === 'true';
  const realData = useInsightsData(period);
  const demoData = useDemoInsightsData();
  
  const { chartData, radarData, dyadOccurrences, patterns, stats, weeklySummary, isLoading, isEmpty } = isDemoMode ? demoData : realData;

  // Check if user has preview-only access (should show overlay)
  const isPreviewOnly = accessLevel === 'preview' && !isDemoMode;

  const handleEnterDemo = () => {
    setSearchParams({ demo: 'true' });
  };

  const handleExitDemo = () => {
    setSearchParams({});
  };

  const getPatternTypeStyles = (type?: 'positive' | 'attention' | 'neutral') => {
    switch (type) {
      case 'positive':
        return 'border-l-emerald-500 bg-emerald-500/5';
      case 'attention':
        return 'border-l-orange-500 bg-orange-500/5';
      default:
        return 'border-l-primary bg-primary/5';
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col pb-28">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-8 px-6 pb-4"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Seus Insights</h1>
            <p className="text-sm text-muted-foreground mt-1">Acompanhe seu bem-estar</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Period Selector - 7d, 30d, 90d */}
        <div className="flex gap-1 p-1 bg-muted/50 rounded-2xl">
          {(['7d', '30d', '90d'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                period === p
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : '90 dias'}
            </button>
          ))}
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 px-6 space-y-5">
        {/* Demo Banner */}
        {isDemoMode && <DemoBanner onExitDemo={handleExitDemo} />}

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        ) : isEmpty && !isDemoMode ? (
          <EmptyInsightsState onEnterDemo={handleEnterDemo} />
        ) : (
          <>
            {/* Weekly Summary Card */}
            <WeeklySummaryCard summary={weeklySummary} />

            {/* Stats Summary */}
            <InsightsStats stats={stats} />

            {/* Emotion Radar Chart */}
            <EmotionRadarChart data={radarData} />

            {/* Evolution Chart */}
            {chartData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card-elevated p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Evolução Emocional</span>
                </div>
                
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPositivo" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--calm))" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="hsl(var(--calm))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorNegativo" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis hide domain={[0, 5]} />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '12px',
                          fontSize: '12px',
                          boxShadow: 'var(--shadow-md)'
                        }}
                        labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="positivo" 
                        stroke="hsl(var(--calm))" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorPositivo)" 
                        name="Positivo"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="negativo" 
                        stroke="hsl(var(--secondary))" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorNegativo)" 
                        name="Desafiador"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-calm" />
                    <span className="text-xs font-medium text-muted-foreground">Positivo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary" />
                    <span className="text-xs font-medium text-muted-foreground">Desafiador</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Dyad Timeline */}
            <DyadTimeline dyads={dyadOccurrences} />

            {/* Patterns Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-sm font-semibold text-foreground">Padrões Identificados</span>
              </div>

              <div className="space-y-3">
                {patterns.map((pattern, index) => (
                  <motion.div
                    key={pattern.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.08 }}
                    className={`card-elevated p-4 flex items-start gap-3 border-l-4 ${getPatternTypeStyles(pattern.type)}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl flex-shrink-0">
                      {pattern.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">{pattern.title}</h3>
                        {pattern.type === 'attention' && (
                          <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{pattern.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Full Report Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <Button
                onClick={() => navigate(isDemoMode ? '/report?demo=true' : '/report')}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold text-base shadow-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Ver Relatório Inteligente com IA
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </motion.div>
          </>
        )}

        {/* Preview overlay for restricted access */}
        {isPreviewOnly && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm flex items-center justify-center px-6"
            onClick={() => setShowUpgradeModal(true)}
          >
            <div className="bg-card border border-border rounded-3xl p-6 max-w-sm text-center shadow-xl">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Insights Premium</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Você está visualizando uma prévia. Faça upgrade para acessar todos os seus insights emocionais.
              </p>
              <Button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full h-12 rounded-xl font-semibold"
              >
                Desbloquear Insights
              </Button>
            </div>
          </motion.div>
        )}
      </main>

      <BottomNavigation />

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureTitle="Insights Emocionais"
        featureDescription="Acesse análises detalhadas do seu bem-estar emocional, gráficos de tendências e padrões identificados pela IA."
      />
    </div>
  );
}
