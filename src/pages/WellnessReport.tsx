import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWellnessReport, Period } from "@/hooks/useWellnessReport";
import { ReportHeader } from "@/components/report/ReportHeader";
import { WellnessScoreCard } from "@/components/report/WellnessScoreCard";
import { DataSummaryCards } from "@/components/report/DataSummaryCards";
import { WeeklyNarrative } from "@/components/report/WeeklyNarrative";
import { EmotionalInsights } from "@/components/report/EmotionalInsights";
import { CorrelationsSection } from "@/components/report/CorrelationsSection";
import { RecommendationsSection } from "@/components/report/RecommendationsSection";
import { AchievementsSection } from "@/components/report/AchievementsSection";
import { Skeleton } from "@/components/ui/skeleton";
import { BottomNavigation } from "@/components/BottomNavigation";

const WellnessReport: React.FC = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>('7d');
  const { data: report, isLoading, error, refetch } = useWellnessReport(period);

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-5 py-4">
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-secondary/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <h1 className="text-lg font-semibold text-foreground">Relatório de Bem-Estar</h1>
        </div>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Loading State */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-40 w-full rounded-2xl" />
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </motion.div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Erro ao gerar relatório
              </h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                {error.message || 'Não foi possível gerar seu relatório. Tente novamente.'}
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => refetch()}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium"
              >
                Tentar Novamente
              </motion.button>
            </motion.div>
          )}

          {/* Report Content */}
          {report && !isLoading && (
            <motion.div
              key="report"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-5"
            >
              <ReportHeader
                userName={report.userName}
                period={period}
                onPeriodChange={handlePeriodChange}
                onRefresh={() => refetch()}
                isLoading={isLoading}
              />

              <WellnessScoreCard
                score={report.wellnessScore}
                emoji={report.weekEmoji}
                headline={report.headline}
              />

              <DataSummaryCards summary={report.dataSummary} />

              <WeeklyNarrative narrative={report.narrative} />

              <EmotionalInsights insights={report.emotionalInsights} />

              <CorrelationsSection correlations={report.correlations} />

              <RecommendationsSection recommendations={report.recommendations} />

              <AchievementsSection achievements={report.achievements} />

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="pt-4 text-center"
              >
                <p className="text-xs text-muted-foreground">
                  Relatório gerado por IA em {new Date(report.generatedAt).toLocaleString('pt-BR')}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default WellnessReport;
