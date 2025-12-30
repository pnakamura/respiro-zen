import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Sparkles, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useInsightsData } from '@/hooks/useInsightsData';
import { EmptyInsightsState } from '@/components/insights/EmptyInsightsState';
import { InsightsStats } from '@/components/insights/InsightsStats';
import { Skeleton } from '@/components/ui/skeleton';

type Period = '7d' | '30d' | '90d';

export default function Insights() {
  const [period, setPeriod] = useState<Period>('7d');
  const { chartData, patterns, stats, isLoading, isEmpty } = useInsightsData(period);

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

        {/* Period Selector */}
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
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        ) : isEmpty ? (
          <EmptyInsightsState />
        ) : (
          <>
            {/* Stats Summary */}
            <InsightsStats stats={stats} />

            {/* Emotion Chart */}
            {chartData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card-elevated p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Evolução Emocional</span>
                </div>
                
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
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
                      />
                      <Line type="monotone" dataKey="alegria" stroke="hsl(var(--energy))" strokeWidth={2.5} dot={false} />
                      <Line type="monotone" dataKey="tristeza" stroke="hsl(var(--meditate))" strokeWidth={2.5} dot={false} />
                      <Line type="monotone" dataKey="calma" stroke="hsl(var(--calm))" strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-5 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-energy" />
                    <span className="text-xs font-medium text-muted-foreground">Alegria</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-meditate" />
                    <span className="text-xs font-medium text-muted-foreground">Tristeza</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-calm" />
                    <span className="text-xs font-medium text-muted-foreground">Calma</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Patterns Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
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
                    transition={{ delay: 0.3 + index * 0.08 }}
                    className="card-elevated p-4 flex items-start gap-3 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl">
                      {pattern.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-foreground">{pattern.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{pattern.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground mt-1" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Full Report Button */}
            <Button
              variant="outline"
              className="w-full h-12 rounded-2xl border-primary/30 text-primary hover:bg-primary/5 font-semibold"
            >
              Ver Relatório Completo
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}