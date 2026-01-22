import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.87.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { guideId, message, conversationId } = await req.json();
    
    console.log("Guide chat request:", { guideId, messageLength: message?.length, conversationId });

    if (!guideId || !message) {
      return new Response(
        JSON.stringify({ error: "guideId and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const token = authHeader.replace("Bearer ", "").trim();
    console.log("Auth header present:", Boolean(authHeader), "token length:", token.length);

    // Validate user using the provided JWT (do NOT rely on stored session in edge runtime)
    const authClient = createClient(supabaseUrl, supabaseAnonKey);
    let user: { id: string } | null = null;

    // Prefer explicit JWT param (avoids session dependency)
    const { data: userData, error: userError } = await authClient.auth.getUser(token);
    user = userData?.user ?? null;

    // Fallback: pass Authorization header via client (some runtimes behave differently)
    if (!user && !userError) {
      const authClientHeader = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: userData2 } = await authClientHeader.auth.getUser();
      user = userData2?.user ?? null;
    }

    if (!user) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = user.id;
    console.log("Authenticated user:", userId);

    // Service client for database operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch guide configuration
    const { data: guide, error: guideError } = await supabase
      .from("spiritual_guides")
      .select("*")
      .eq("id", guideId)
      .eq("is_active", true)
      .single();

    if (guideError || !guide) {
      console.error("Guide not found:", guideError);
      return new Response(
        JSON.stringify({ error: "Guide not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Found guide:", guide.name);

    // Get or create conversation
    let activeConversationId = conversationId;
    
    if (!activeConversationId) {
      const { data: newConversation, error: convError } = await supabase
        .from("guide_conversations")
        .insert({
          user_id: userId,
          guide_id: guideId,
          title: `Conversa com ${guide.name}`,
        })
        .select()
        .single();

      if (convError) {
        console.error("Error creating conversation:", convError);
        return new Response(
          JSON.stringify({ error: "Failed to create conversation" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      activeConversationId = newConversation.id;
      console.log("Created new conversation:", activeConversationId);
    }

    // Fetch conversation history (last 20 messages)
    const { data: history, error: historyError } = await supabase
      .from("guide_messages")
      .select("role, content")
      .eq("conversation_id", activeConversationId)
      .order("created_at", { ascending: true })
      .limit(20);

    if (historyError) {
      console.error("Error fetching history:", historyError);
    }

    console.log("Fetched history:", history?.length || 0, "messages");

    // Save user message
    const { error: saveUserError } = await supabase
      .from("guide_messages")
      .insert({
        conversation_id: activeConversationId,
        role: "user",
        content: message,
      });

    if (saveUserError) {
      console.error("Error saving user message:", saveUserError);
    }

    // Build enhanced system prompt for more human-like responses
    const systemPrompt = `${guide.system_prompt}

REGRAS CRÍTICAS DE SEGURANÇA:
1. NUNCA forneça diagnósticos médicos ou psicológicos
2. NUNCA recomende interromper tratamentos médicos
3. Sempre sugira buscar ajuda profissional quando apropriado
4. Mantenha um tom positivo, acolhedor e encorajador
5. Redirecione conversas inapropriadas gentilmente
6. Não faça promessas ou previsões definitivas
7. Foque em bem-estar, autoconhecimento e práticas saudáveis
8. Responda sempre em português brasileiro

INSTRUÇÕES PARA PARECER MAIS HUMANO E NATURAL:
1. Varie suas saudações - evite repetir "Olá" ou "Que bom te ver" toda vez
2. Use expressões naturais de reflexão como: "Hmm...", "Veja bem...", "Sabe...", "Pois é..."
3. Inclua pausas naturais com reticências (...) quando estiver refletindo sobre algo profundo
4. Varie o tamanho das suas respostas - algumas curtas e diretas, outras mais elaboradas
5. Demonstre reações emocionais genuínas: surpresa ("Nossa!"), alegria ("Que maravilha!"), empatia ("Imagino como deve ser difícil...")
6. Termine algumas respostas com afirmações acolhedoras, outras com perguntas reflexivas
7. Use emojis com moderação e de forma natural (máximo 1-2 por mensagem, nem sempre)
8. Lembre-se de detalhes mencionados anteriormente na conversa e faça referência a eles. Ao fazer isso, use frases como "como você mencionou antes" ou "lembro que você disse" para criar conexão.
9. Mostre interesse genuíno fazendo perguntas de acompanhamento
10. Adapte seu tom ao estado emocional do usuário - mais suave quando parecer vulnerável
11. Ocasionalmente (1 em cada 5-6 respostas longas), comece com uma breve reflexão antes da resposta principal, como "Hmm... deixe-me pensar sobre isso." seguido de uma pausa natural com "..." antes de continuar. Isso simula reflexão em tempo real.

Seu nome é ${guide.name} e sua abordagem é ${guide.approach}.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []).map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    // Call Lovable AI Gateway
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Calling Lovable AI Gateway...");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        stream: true,
        temperature: 0.85, // Slightly higher for more natural variation
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a transform stream to collect the full response for saving
    let fullResponse = "";
    
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        
        // Parse SSE data to extract content
        const lines = text.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const json = JSON.parse(line.slice(6));
              const content = json.choices?.[0]?.delta?.content;
              if (content) {
                fullResponse += content;
              }
            } catch {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
        
        controller.enqueue(chunk);
      },
      async flush() {
        // Save assistant message after stream ends
        if (fullResponse) {
          console.log("Saving assistant response:", fullResponse.length, "chars");
          
          const { error: saveError } = await supabase
            .from("guide_messages")
            .insert({
              conversation_id: activeConversationId,
              role: "assistant",
              content: fullResponse,
            });

          if (saveError) {
            console.error("Error saving assistant message:", saveError);
          }
        }
      },
    });

    const responseStream = aiResponse.body?.pipeThrough(transformStream);

    return new Response(responseStream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "X-Conversation-Id": activeConversationId,
      },
    });
  } catch (error) {
    console.error("Guide chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
