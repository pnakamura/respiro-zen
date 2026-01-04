import { motion } from "framer-motion";
import { Calendar, RefreshCw } from "lucide-react";
import { Period } from "@/hooks/useWellnessReport";

interface ReportHeaderProps {
  userName: string;
  period: Period;
  onPeriodChange: (period: Period) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function ReportHeader({ 
  userName, 
  period, 
  onPeriodChange, 
  onRefresh, 
  isLoading 
}: ReportHeaderProps) {
  const periodLabels: Record<Period, string> = {
    '7d': '7 dias',
    '30d': '30 dias',
    '90d': '90 dias',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-foreground"
          >
            Seu Relatório
          </motion.h1>
          <p className="text-muted-foreground text-sm mt-1">
            Olá, {userName}! Veja como foi sua jornada.
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9, rotate: 180 }}
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 rounded-full bg-secondary/50 text-muted-foreground hover:bg-secondary transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      {/* Period selector */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <div className="flex gap-1 bg-secondary/30 rounded-lg p-1">
          {(['7d', '30d', '90d'] as Period[]).map((p) => (
            <motion.button
              key={p}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPeriodChange(p)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                period === p
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {periodLabels[p]}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
