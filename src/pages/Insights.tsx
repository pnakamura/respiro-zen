import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Sparkles, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/BottomNavigation';

// Sample data - would come from Supabase
const mockChartData = [
  { day: 'Seg', alegria: 4, tristeza: 2, calma: 3 },
  { day: 'Ter', alegria: 3, tristeza: 3, calma: 4 },
  { day: 'Qua', alegria: 5, tristeza: 1, calma: 4 },
  { day: 'Qui', alegria: 4, tristeza: 2, calma: 5 },
  { day: 'Sex', alegria: 3, tristeza: 4, calma: 3 },
  { day: 'Sáb', alegria: 5, tristeza: 1, calma: 5 },
  { day: 'Dom', alegria: 4, tristeza: 2, calma: 4 },
];

const patterns = [
  {
    id: 1,
    icon: '🌅',
    title: 'Manhãs mais calmas',
    description: 'Você tende a se sentir mais calmo nas manhãs de segunda e quarta.',
  },
  {
    id: 2,
    icon: '📈',
    title: 'Melhoria consistente',
    description: 'Sua alegria aumentou 15% nas últimas 2 semanas.',
  },
  {
    id: 3,
    icon: '🧘',
    title: 'Meditação ajuda',
    description: 'Após meditar, sua calma aumenta em média 30%.',
  },
];

type Period = '7d' | '30d' | '90d';

export default function Insights() {
  const [period, setPeriod] = useState<Period>('7d');

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background pb-20">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-8 px-6 pb-4"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Seus Insights</h1>
            <p className="text-sm text-muted-foreground">Acompanhe seu bem-estar emocional</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 p-1 bg-muted rounded-xl">
          {(['7d', '30d', '90d'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
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
      <main className="flex-1 px-6 space-y-6">
        {/* Emotion Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Evolução Emocional</span>
          </div>
          
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  hide 
                  domain={[0, 5]} 
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="alegria" 
                  stroke="hsl(var(--energy))" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="tristeza" 
                  stroke="hsl(var(--meditate))" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="calma" 
                  stroke="hsl(var(--calm))" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-energy" />
              <span className="text-xs text-muted-foreground">Alegria</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-meditate" />
              <span className="text-xs text-muted-foreground">Tristeza</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-calm" />
              <span className="text-xs text-muted-foreground">Calma</span>
            </div>
          </div>
        </motion.div>

        {/* Patterns Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-panic" />
            <span className="text-sm font-medium text-foreground">Padrões Identificados</span>
          </div>

          <div className="space-y-3">
            {patterns.map((pattern, index) => (
              <motion.div
                key={pattern.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-card rounded-xl p-4 flex items-start gap-3"
              >
                <span className="text-2xl">{pattern.icon}</span>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-foreground">{pattern.title}</h3>
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
          className="w-full h-12 rounded-xl border-primary/20 text-primary hover:bg-primary/5"
        >
          Ver Relatório Completo
        </Button>
      </main>

      <BottomNavigation />
    </div>
  );
}
