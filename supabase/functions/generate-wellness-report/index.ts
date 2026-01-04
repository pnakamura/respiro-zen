import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmotionEntry {
  id: string;
  created_at: string;
  selected_emotions: Array<{ id: string; name: string; intensity: number }>;
  detected_dyads: Array<{ name: string }>;
  free_text: string | null;
}

interface BreathingSession {
  technique_name: string;
  duration_ms: number;
  cycles_completed: number;
  completed_at: string;
}

interface JournalEntry {
  content: string;
  word_count: number;
  created_at: string;
}

interface HydrationRecord {
  quantidade_ml: number;
  horario: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { period = '7d' } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate date range
    const days = period === '30d' ? 30 : period === '90d' ? 90 : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString();

    console.log(`Generating wellness report for user ${user.id}, period: ${period}`);

    // Fetch all user data in parallel
    const [emotionsResult, breathingResult, journalResult, hydrationResult, userResult] = await Promise.all([
      supabase
        .from('emotion_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDateStr)
        .order('created_at', { ascending: true }),
      supabase
        .from('breathing_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_at', startDateStr)
        .order('completed_at', { ascending: true }),
      supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDateStr)
        .order('created_at', { ascending: true }),
      supabase
        .from('registro_hidratacao')
        .select('*')
        .eq('usuario_id', user.id)
        .gte('horario', startDateStr)
        .is('deletado_em', null),
      supabase
        .from('usuarios')
        .select('nome_completo')
        .eq('id', user.id)
        .single()
    ]);

    const emotions = (emotionsResult.data || []) as EmotionEntry[];
    const breathingSessions = (breathingResult.data || []) as BreathingSession[];
    const journalEntries = (journalResult.data || []) as JournalEntry[];
    const hydrationRecords = (hydrationResult.data || []) as HydrationRecord[];
    const userName = userResult.data?.nome_completo || 'Usuário';

    console.log(`Data fetched: ${emotions.length} emotions, ${breathingSessions.length} breathing, ${journalEntries.length} journal, ${hydrationRecords.length} hydration`);

    // Process data for AI analysis
    const emotionSummary = processEmotions(emotions);
    const breathingSummary = processBreathing(breathingSessions);
    const journalSummary = processJournal(journalEntries);
    const hydrationSummary = processHydration(hydrationRecords);

    // Generate AI report
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `Você é um coach de bem-estar empático e acolhedor chamado "Sentir". 
Sua missão é analisar dados de bem-estar do usuário e gerar um relatório semanal personalizado em português brasileiro.

DIRETRIZES:
- Use um tom caloroso, encorajador e não julgador
- Celebre pequenas vitórias e progressos
- Normalize dificuldades como parte da jornada
- Sugira ações concretas e alcançáveis
- Identifique padrões e correlações nos dados
- Use emojis com moderação para adicionar calor
- Seja conciso mas significativo

ESTRUTURA DO RELATÓRIO (responda APENAS em JSON válido):
{
  "wellnessScore": number (0-100 baseado nos dados),
  "weekEmoji": "emoji representativo",
  "headline": "frase de destaque da semana (max 15 palavras)",
  "narrative": "narrativa empática sobre a semana (2-3 parágrafos curtos)",
  "emotionalInsights": [
    { "title": "insight", "description": "explicação", "type": "positive|neutral|attention" }
  ],
  "correlations": [
    { "insight": "correlação descoberta", "confidence": "alta|média|baixa" }
  ],
  "recommendations": [
    { "action": "ação sugerida", "reason": "por que ajuda", "category": "respiração|meditação|diário|hidratação|jornada" }
  ],
  "achievements": [
    { "title": "conquista", "emoji": "🏆" }
  ],
  "weekdayPatterns": {
    "bestDay": "dia da semana",
    "challengingDay": "dia da semana",
    "insight": "observação"
  }
}`;

    const userPrompt = `Analise os dados de bem-estar de ${userName} dos últimos ${days} dias e gere o relatório:

DADOS EMOCIONAIS:
- Total de check-ins: ${emotionSummary.totalCheckins}
- Emoções mais frequentes: ${emotionSummary.topEmotions.join(', ') || 'Nenhuma registrada'}
- Intensidade média: ${emotionSummary.avgIntensity.toFixed(1)}/5
- Díades detectadas: ${emotionSummary.dyads.join(', ') || 'Nenhuma'}
- Distribuição por dia: ${JSON.stringify(emotionSummary.byWeekday)}

PRÁTICAS DE RESPIRAÇÃO:
- Total de sessões: ${breathingSummary.totalSessions}
- Minutos totais: ${breathingSummary.totalMinutes}
- Técnicas usadas: ${breathingSummary.techniques.join(', ') || 'Nenhuma'}
- Ciclos completados: ${breathingSummary.totalCycles}

DIÁRIO:
- Entradas: ${journalSummary.totalEntries}
- Palavras totais: ${journalSummary.totalWords}
- Trechos recentes: ${journalSummary.excerpts.slice(0, 3).join(' | ') || 'Nenhum'}

HIDRATAÇÃO:
- Registros: ${hydrationSummary.totalRecords}
- Média diária: ${hydrationSummary.avgDaily}ml
- Dias com registro: ${hydrationSummary.daysWithRecord}

Gere o relatório considerando estes dados. Se houver poucos dados, encoraje o usuário a registrar mais para insights melhores.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error('No content from AI');
    }

    // Parse AI response (handle markdown code blocks)
    let report;
    try {
      const jsonMatch = aiContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                        aiContent.match(/```\s*([\s\S]*?)\s*```/) ||
                        [null, aiContent];
      const jsonStr = jsonMatch[1] || aiContent;
      report = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiContent);
      // Return fallback report
      report = {
        wellnessScore: calculateBasicScore(emotionSummary, breathingSummary, journalSummary),
        weekEmoji: "🌱",
        headline: "Sua jornada de bem-estar está em andamento",
        narrative: "Continue registrando suas emoções e práticas para receber insights personalizados.",
        emotionalInsights: [],
        correlations: [],
        recommendations: [
          { action: "Faça um check-in emocional diário", reason: "Ajuda a entender seus padrões", category: "emocional" }
        ],
        achievements: [],
        weekdayPatterns: null
      };
    }

    // Add raw data summaries to report
    report.dataSummary = {
      emotions: emotionSummary,
      breathing: breathingSummary,
      journal: journalSummary,
      hydration: hydrationSummary
    };
    report.generatedAt = new Date().toISOString();
    report.period = period;
    report.userName = userName.split(' ')[0]; // First name only

    console.log('Report generated successfully');

    return new Response(JSON.stringify(report), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error generating wellness report:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate report';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function processEmotions(emotions: EmotionEntry[]) {
  const emotionCounts: Record<string, number> = {};
  const dyadSet = new Set<string>();
  let totalIntensity = 0;
  let intensityCount = 0;
  const byWeekday: Record<string, number> = {};

  emotions.forEach(entry => {
    const date = new Date(entry.created_at);
    const weekday = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][date.getDay()];
    byWeekday[weekday] = (byWeekday[weekday] || 0) + 1;

    if (Array.isArray(entry.selected_emotions)) {
      entry.selected_emotions.forEach((em: any) => {
        const name = em.name || em.id;
        emotionCounts[name] = (emotionCounts[name] || 0) + 1;
        if (em.intensity) {
          totalIntensity += em.intensity;
          intensityCount++;
        }
      });
    }

    if (Array.isArray(entry.detected_dyads)) {
      entry.detected_dyads.forEach((d: any) => {
        if (d.name) dyadSet.add(d.name);
      });
    }
  });

  const topEmotions = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name]) => name);

  return {
    totalCheckins: emotions.length,
    topEmotions,
    avgIntensity: intensityCount > 0 ? totalIntensity / intensityCount : 0,
    dyads: Array.from(dyadSet),
    byWeekday
  };
}

function processBreathing(sessions: BreathingSession[]) {
  const techniqueSet = new Set<string>();
  let totalMs = 0;
  let totalCycles = 0;

  sessions.forEach(s => {
    techniqueSet.add(s.technique_name);
    totalMs += s.duration_ms || 0;
    totalCycles += s.cycles_completed || 0;
  });

  return {
    totalSessions: sessions.length,
    totalMinutes: Math.round(totalMs / 60000),
    techniques: Array.from(techniqueSet),
    totalCycles
  };
}

function processJournal(entries: JournalEntry[]) {
  const excerpts = entries.map(e => {
    const content = e.content || '';
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  });

  return {
    totalEntries: entries.length,
    totalWords: entries.reduce((sum, e) => sum + (e.word_count || 0), 0),
    excerpts
  };
}

function processHydration(records: HydrationRecord[]) {
  const dailyTotals: Record<string, number> = {};

  records.forEach(r => {
    const date = new Date(r.horario).toISOString().split('T')[0];
    dailyTotals[date] = (dailyTotals[date] || 0) + r.quantidade_ml;
  });

  const daysWithRecord = Object.keys(dailyTotals).length;
  const totalMl = Object.values(dailyTotals).reduce((sum, ml) => sum + ml, 0);

  return {
    totalRecords: records.length,
    avgDaily: daysWithRecord > 0 ? Math.round(totalMl / daysWithRecord) : 0,
    daysWithRecord
  };
}

function calculateBasicScore(emotions: any, breathing: any, journal: any): number {
  let score = 50; // Base score
  
  if (emotions.totalCheckins > 0) score += Math.min(15, emotions.totalCheckins * 2);
  if (breathing.totalSessions > 0) score += Math.min(15, breathing.totalSessions * 3);
  if (journal.totalEntries > 0) score += Math.min(10, journal.totalEntries * 2);
  if (emotions.avgIntensity > 3) score += 5;
  
  return Math.min(100, score);
}
